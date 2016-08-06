/**
 * Implementation of the `akismet.Application` class.
 * @module server/app
 */
const fs = require('fs');
const path = require('path');
const pkg = require('../../package.json');
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

    program._name = 'akismet';
    program
      .version(pkg.version)
      .option('-p, --port <port>', `port that the reverse proxy should run on [${Server.DEFAULT_PORT}]`, format.asInteger, Server.DEFAULT_PORT)
      .option('-h, --host <host>', `host that the reverse proxy should run on [${Server.DEFAULT_HOST}]`, Server.DEFAULT_HOST)
      .option('-r, --redirect <url>', 'the URL to redirect when a request is unhandled')
      .option('-u, --user <user>', 'user to drop privileges to once server socket is bound', format.asIntegerIfNumeric)
      .option('--silent', 'silence the log output from the server');

    program.parse(process.argv);

    // Start the server.
    this.startServer(program.port, program.host, program.redirect ? program.redirect : null)
      .then(() => {
        if(program.user) this.setUser(program.user);
      })
      .catch(err => {
        console.log(`ERROR - ${this.debug ? err.stack : err.message}`);
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
   * Starts a server listening for HTTP requests.
   * @param {number} [port] The port that the server should run on.
   * @param {string} [host] The host that the server should run on.
   * @param {string} [redirectURL] The URL to redirect the user when a request is unhandled.
   * @return {Promise} Completes when the server has been started.
   */
  startServer(port = -1, host = '', redirectURL = '') {
    let server = new Server({redirectURL});
    server.on('close', () => this.log(`Akismet server on ${server.host}:${server.port} closed`));
    server.on('error', err => this.log(`ERROR - ${this.debug ? err.stack : err.message}`));

    server.on('request', req => {
      let ipAddress = req.connection.remoteAddress;
      let userAgent = req.headers['user-agent'];
      this.log(`${ipAddress} - "${req.method} ${req.url} HTTP/${req.httpVersion}" "${userAgent}"`);
    });

    return server.listen(port, host).then(() =>
      this.log(`Akismet server listening on ${server.host}:${server.port}`)
    );
  }
}

// Public interface.
module.exports = Application;
