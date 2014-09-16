#!/usr/bin/env node

/**
 * Command line interface.
 * @module bin.cli
 */
'use strict';

// Module dependencies.
var program=require('commander');
var Server=require('../lib/server');
var util=require('util');

/**
 * Represents an application providing functionalities specific to console requests.
 * @class cli.Application
 * @static
 */
var Application={

  /**
   * The application name.
   * @property name
   * @type String
   */
  name: 'akismet',

  /**
   * Runs the application.
   * @method run
   */
  run: function() {
    process.chdir(__dirname+'/..');
    process.title=this.name+'.js';

    // Parse command line arguments.
    program._name=this.name;
    program
      .version(require('../package.json').version)
      .option('-p, --port <port>', 'port that the server should run on [3000]', function(value) { return parseInt(value, 10); }, 3000)
      .option('-h, --host <host>', 'host that the server should run on [0.0.0.0]', '0.0.0.0')
      .option('-r, --redirect <url>', 'the URL to redirect when a request is unhandled')
      .option('--silent', 'silence the log output from the server')
      .parse(process.argv);

    // Start the server.
    var self=this;
    var server=new Server({ redirectUrl: program.redirect ? program.redirect : null });

    server.on('error', function(err) {
      _self.log(util.format('ERROR - %s', err));
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

    server.listen(program.port, program.host, function() {
      self._log(util.format('Akismet server listening on %s:%d', program.host, program.port));
    });
  },

  /**
   * Prints the specified message, with a timestamp and a new line, to the standard output.
   * @method _log
   * @param {String|Function} message The message to be logged. If it's a function, the message is the result of the function call.
   * @private
   */
  _log: function(message) {
    if(!program.silent) console.log('[%s] %s', new Date().toUTCString(), message instanceof Function ? message() : message);
  }
};

// Public interface.
if(module===require.main) Application.run();
else module.exports=Application;
