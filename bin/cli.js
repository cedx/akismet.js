#!/usr/bin/env node

/**
 * Command line interface.
 * @module bin/cli
 */
'use strict';

// Module dependencies.
const program=require('commander');
const Server=require('../lib/server');
const util=require('util');

/**
 * Represents an application providing functionalities specific to console requests.
 */
var Application={

  /**
   * The application name.
   * @var {string}
   */
  name: 'akismet',

  /**
   * Runs the application.
   */
  run: function() {
    process.chdir(__dirname+'/..');
    process.title=this.name+'.js';

    program._name=this.name;
    program
      .version(require('../package.json').version)
      .option('-p, --port <port>', 'port that the server should run on [3000]', function(value) { return parseInt(value, 10); }, 3000)
      .option('-h, --host <host>', 'host that the server should run on [0.0.0.0]', '0.0.0.0')
      .option('-r, --redirect <url>', 'the URL to redirect when a request is unhandled')
      .option('--silent', 'silence the log output from the server')
      .parse(process.argv);

    this._startServer(program.port, program.host, program.redirect ? program.redirect : null);
  },

  /**
   * Prints the specified message, with a timestamp and a new line, to the standard output.
   * @param {string|function} message The message to be logged. If it's a function, the message is the result of the function call.
   * @private
   */
  _log: function(message) {
    if(!program.silent) console.log('[%s] %s', new Date().toUTCString(), typeof message=='function' ? message() : message);
  },

  /**
   * Starts a server listening for HTTP requests.
   * @param {number} port The port that the server should run on.
   * @param {string} host The host that the server should run on.
   * @param {string} [redirectUrl] The URL to redirect the user when a request is unhandled.
   * @private
   */
  _startServer: function(port, host, redirectUrl) {
    var self=this;
    var server=new Server({ redirectUrl: redirectUrl });

    server.on('error', function(err) {
      self._log(util.format('ERROR - %s', err));
    });

    server.on('request', function(req) {
      self._log(util.format(
        '%s - "%s %s HTTP/%s" "%s"',
        req.connection.remoteAddress,
        req.method,
        req.url,
        req.httpVersion,
        req.headers['user-agent']
      ));
    });

    server.listen(port, host).then(function() {
      self._log(util.format('Akismet server listening on %s:%d', host, port));
    });
  }
};

// Public interface.
if(module===require.main) Application.run();
else module.exports=Application;
