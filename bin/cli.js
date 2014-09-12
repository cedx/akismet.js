#!/usr/bin/env node

/**
 * Command line interface.
 * @module bin.cli
 */
'use strict';

// Module dependencies.
var program=require('commander');
var Server=require('../index').Server;
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
      .option('-a, --address <address>', 'the address to which to listen [0.0.0.0]', '0.0.0.0')
      .option('-p, --port <port>', 'the port on which to listen [3000]', function(value) { return parseInt(value, 10); }, 3000)
      .option('-r, --redirect <url>', 'the URL to redirect when a request is unhandled')
      .option('--silent', 'silence the log output from the server')
      .parse(process.argv);

    program.help();
  },

  /**
   * Prints the specified message, with a timestamp and a new line, to the standard output.
   * @method _log
   * @param {String|Function} message The message to be logged. If it's a function, the message is the result of the function call.
   * @private
   */
  _log: function(message) {
    if(!program.silent) console.log('[%s] %s', new Date().toUTCString(), message instanceof Function ? message() : message);
  },

  /**
   * Starts the specified reverse proxy instances.
   * @method _start
   * @param {Function} [callback] The function to invoke when all servers are started.
   * @async
   * @private
   */
  _start: function(callback) {
    if(callback instanceof Function) callback();
  }
};

// Public interface.
if(module===require.main) Application.run();
else module.exports=Application;
