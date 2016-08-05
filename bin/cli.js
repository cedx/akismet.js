#!/usr/bin/env node

/**
 * Command line interface.
 * @module bin/cli
 */
'use strict';

const pkg = require('../package.json');
const program = require('commander');
const Server = require('../lib/server');

/**
 * Represents an application providing functionalities specific to console requests.
 */
class Application {

  /**
   * Initializes a new instance of the class.
   */
  constructor() {
    const format = {
      asInteger: value => parseInt(value, 10),
      asIntegerIfNumeric: value => /^\d+$/.test(value) ? parseInt(value, 10) : value
    };

    program._name = 'akismet';
    program
      .version(pkg.version)
      .option('-p, --port <port>', 'port that the reverse proxy should run on [3000]', format.asInteger, 3000)
      .option('-H, --host <host>', 'host that the server should run on [0.0.0.0]', '0.0.0.0')
      .option('-r, --redirect <url>', 'the URL to redirect when a request is unhandled')
      .option('-u, --user <user>', 'user to drop privileges to once server socket is bound', format.asIntegerIfNumeric)
      .option('--silent', 'silence the log output from the server');
  }

  /**
   * Runs the application.
   */
  run() {
    program.parse(process.argv);
    this.startServer(program.port, program.host, program.redirect ? program.redirect : null).then(
      () => { if(program.user) this.setUser(program.user); },
      this._errorHandler.bind(this)
    );
  }

  /**
   * Sets the user identity of the application process.
   * @param {number|string} userId The user identifier.
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
   * @param {number} port The port that the server should run on.
   * @param {string} host The host that the server should run on.
   * @param {string} [redirectUrl] The URL to redirect the user when a request is unhandled.
   * @return {Promise} Completes when the server has been started.
   */
  startServer(port, host, redirectUrl) {
    let server = new Server({redirectUrl: redirectUrl});
    server.on('close', () => this.log(`Akismet server on ${server.host}:${server.port} closed`));
    server.on('error', this._errorHandler.bind(this));
    server.on('listening', () => this.log(`Akismet server listening on ${server.host}:${server.port}`));

    server.on('request', req => {
      let ipAddress = req.connection.remoteAddress;
      let userAgent = req.headers['user-agent'];
      this.log(`${ipAddress} - "${req.method} ${req.url} HTTP/${req.httpVersion}" "${userAgent}"`);
    });

    return server.listen(port, host);
  }

  /**
   * Logs the error events and their associated stack trace to the standard output.
   * @param error An error event to be logged.
   */
  _errorHandler(error) {
    let message = `ERROR - ${error}`;
    if((error instanceof Error) && 'stack' in error) message += ` ${error.stack}`;
    this.log(message);
  }
}

// Run the application.
let application = new Application();

if(module === require.main) {
  process.title = 'akismet';
  global.app = application;
  global.app.run();
}

// Public interface.
module.exports = application;
