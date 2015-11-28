#!/usr/bin/env node

/**
 * Command line interface.
 * @module bin/cli
 */
'use strict';

// Module dependencies.
const pkg=require('../package.json');
const program=require('commander');
const Server=require('../lib/server');

/**
 * Represents an application providing functionalities specific to console requests.
 */
class Application {

  /**
   * Initializes a new instance of the class.
   */
  constructor() {
    program._name='akismet';
    program
      .version(pkg.version)
      .option('-p, --port <port>', 'port that the reverse proxy should run on [3000]', value => parseInt(value, 10), 3000)
      .option('-h, --host <host>', 'host that the server should run on [0.0.0.0]', '0.0.0.0')
      .option('-r, --redirect <url>', 'the URL to redirect when a request is unhandled')
      .option('--silent', 'silence the log output from the server');
  }

  /**
   * Prints the specified message, with a timestamp and a new line, to the standard output.
   * @param {string|function} message The message to be logged. If it's a function, the message is the result of the function call.
   */
  log(message) {
    if(!program.silent) {
      let now=new Date().toUTCString();
      let text=(typeof message=='function' ? message() : message);
      console.log(`[${now}] ${text}`);
    }
  }

  /**
   * Runs the application.
   */
  run() {
    program.parse(process.argv);
    this._startServer(program.port, program.host, program.redirect ? program.redirect : null);
  }

  /**
   * Starts a server listening for HTTP requests.
   * @param {number} port The port that the server should run on.
   * @param {string} host The host that the server should run on.
   * @param {string} [redirectUrl] The URL to redirect the user when a request is unhandled.
   * @return {Promise} Completes when the server has been started.
   * @private
   */
  _startServer(port, host, redirectUrl) {
    let server=new Server({redirectUrl: redirectUrl});
    server.on('error', err => this.log(`ERROR - ${err}`));

    server.on('request', req => {
      let ipAddress=req.connection.remoteAddress;
      let userAgent=req.headers['user-agent'];
      this.log(`${ipAddress} - "${req.method} ${req.url} HTTP/${req.httpVersion}" "${userAgent}"`);
    });

    return server.listen(server.port, server.host).then(() =>
      this.log(`Akismet server listening on ${server.host}:${server.port}`)
    );
  }
}

// Run the application.
if(module===require.main) {
  process.title='akismet.js';
  new Application().run();
}
else module.exports=Application;
