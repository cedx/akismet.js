/**
 * Implementation of the `akismet.Application` class.
 * @module app
 */
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');
const program = require('commander');
const Server = require('./server');

/**
 * Represents an application providing functionalities specific to console requests.
 */
class Application {

  /**
   * Value indicating whether the application runs in debug mode.
   * @type {boolean}
   */
  get debug() {
    return this.env == 'development';
  }

  /**
   * The application environment.
   * @type {string}
   */
  get env() {
    return 'NODE_ENV' in process.env ? process.env.NODE_ENV : 'production';
  }

  /**
   * Loads the application configuration from the file system.
   * @param {object} args The command line arguments.
   * @returns {Promise.<object[]>} An array of objects containing the settings of one or several reverse proxy instances.
   */
  loadConfig(args) {
    if(!args.config) return Promise.resolve([{
      host: args.host,
      port: args.port,
      target: args.target
    }]);

    const readFile = (filePath) => new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if(err) reject(err);
        else resolve(data);
      });
    });

    return readFile(path.resolve(args.config)).then(data => this._parseConfig(data));
  }

  /**
   * Prints the specified message, with a timestamp and a new line, to the standard output.
   * @param {(string|function)} message The message to be logged. If it's a function, the message is the result of the function call.
   */
  log(message) {
    if(!program.silent) {
      let now = new Date().toUTCString();
      let text = typeof message == 'function' ? message() : message;
      console.log(`[${now}] ${text}`);
    }
  }

  /**
   * Runs the application.
   */
  run() {
    // Parse the command line arguments.
    const format = {
      asInteger: value => parseInt(value, 10),
      asIntegerIfNumeric: value => /^\d+$/.test(value) ? parseInt(value, 10) : value
    };

    program._name = 'reverse-proxy';
    program
      .version(pkg.version)
      .option('-p, --port <port>', `port that the reverse proxy should run on [${Server.DEFAULT_PORT}]`, format.asInteger, Server.DEFAULT_PORT)
      .option('-h, --host <host>', `host that the reverse proxy should run on [${Server.DEFAULT_HOST}]`, Server.DEFAULT_HOST)
      .option('-t, --target <target>', 'location of the server the proxy will target', format.asIntegerIfNumeric)
      .option('-c, --config <path>', 'location of the configuration file for the reverse proxy')
      .option('-u, --user <user>', 'user to drop privileges to once server socket is bound', format.asIntegerIfNumeric)
      .option('--silent', 'silence the log output from the reverse proxy');

    program.parse(process.argv);
    if(!program.config && !program.target) program.help();

    // Start the proxy server.
    this.loadConfig(program)
      .then(config => {
        if(!config.length) throw new Error('Unable to find any configuration for the reverse proxy.');
        return this.startServers(config.map(options => new Server(options)));
      })
      .then(() => {
        if(program.user) this.setUser(program.user);
      })
      .catch(err => {
        let message = this.debug ? err.stack : err.message;
        console.log(`ERROR - ${message}`);
        process.exit(1);
      });
  }

  /**
   * Sets the user identity of the application process.
   * @param {(number|string)} userId The user identifier.
   */
  setUser(userId) {
    if(typeof process.setuid != 'function')
      this.log('Changing the process user is not supported on this platform.');
    else {
      this.log(`Drop user privileges to: ${userId}`);
      process.setuid(userId);
    }
  }

  /**
   * Starts the specified reverse proxy instances.
   * @param {Server[]} servers The list of servers to start.
   * @returns {Promise} Completes when all servers have been started.
   */
  startServers(servers) {
    return Promise.all(servers.map(server => {
      server.on('error', err => this.log(`ERROR - ${err}`));

      server.on('request', req => {
        let ipAddress = req.connection.remoteAddress;
        let userAgent = req.headers['user-agent'];
        this.log(`${ipAddress} - ${req.headers.host} - "${req.method} ${req.url} HTTP/${req.httpVersion}" "${userAgent}"`);
      });

      return server.listen().then(() =>
        this.log(`Reverse proxy instance listening on ${server.host}:${server.port}`)
      );
    }));
  }

  /**
   * Parses the specified configuration.
   * @param {string} data A string specifying the application configuration.
   * @returns {object[]} An array of objects corresponding to the parsed configuration.
   * @throws {Error} Neither target nor route table is provided in the specified data.
   */
  _parseConfig(data) {
    data = data.trim();
    if(!data.length) throw new Error('Invalid configuration data.');

    // Determine the source format.
    let firstChar = data[0];
    let lastChar = data[data.length - 1];
    let isJson = (firstChar == '[' || firstChar == '{') && (lastChar == ']' || lastChar == '}');

    // Parse the data.
    let config = [];
    let parser = options => {
      if(!('routes' in options) && !('target' in options))
        throw new Error(`You must provide at least a target or a route table.`);

      if(!('host' in options)) options.host = program.host;
      if(!('port' in options)) options.port = program.port;

      if('ssl' in options) {
        if(Array.isArray(options.ssl.ca))
          options.ssl.ca = options.ssl.ca.map(item => fs.readFileSync(item));

        if('cert' in options.ssl) options.ssl.cert = fs.readFileSync(options.ssl.cert);
        if('key' in options.ssl) options.ssl.key = fs.readFileSync(options.ssl.key);
        if('pfx' in options.ssl) options.ssl.pfx = fs.readFileSync(options.ssl.pfx);
      }

      config.push(options);
    };

    if(!isJson)
      yaml.safeLoadAll(data, parser);
    else {
      let options = JSON.parse(data);
      if(!Array.isArray(options)) options = [options];
      options.forEach(parser);
    }

    return config;
  }
}

// Public interface.
module.exports = Application;
