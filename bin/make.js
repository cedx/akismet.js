#!/usr/bin/env node
/* global cd, config, cp, echo, exec, exit, target */

/**
 * Build system.
 * @module bin.make
 */
'use strict';

// Module dependencies.
require('shelljs/make');
var util=require('util');

/**
 * Provides tasks for [ShellJS](http://shelljs.org) make tool.
 * @class cli.Makefile
 * @static
 */
cd(__dirname+'/..');

/**
 * The application settings.
 * @property config
 * @type Object
 */
config.fatal=true;

/**
 * Runs the default tasks.
 * @method all
 */
target.all=function() {
  echo('Please specify a target. Available targets:');
  for(var task in target) {
    if(task!='all') echo(' ', task);
  }
};

/**
 * Builds the documentation.
 * @method doc
 */
target.doc=function() {
  echo('Build the documentation...');
  exec('yuidoc-bs --theme cerulean');
  cp('-f', [ 'www/apple-touch-icon.png', 'www/favicon.ico' ], 'doc/api/assets');
};

/**
 * Performs static analysis of source code.
 * @method lint
 */
target.lint=function() {
  config.fatal=false;

  echo('Static analysis of source code...');
  exec('jshint --verbose bin lib test');

  echo('Static analysis of documentation comments...');
  exec('yuidoc-bs --lint');

  config.fatal=true;
};

/**
 * Runs the unit tests.
 * @method test
 */
target.test=function() {
  var program=require('commander');
  program._name='make test';

  program
    .version(require('../package.json').version)
    .option('-k, --key <apiKey>', 'the Akismet API key')
    .option('-b, --blog <uri>', 'the front page or home URL [http://dev.belin.io/akismet.js]', 'http://dev.belin.io/akismet.js')
    .parse(process.argv);

  if(!program.key) program.help();

  echo('Run the unit tests...');
  var result=exec(util.format(
    'mocha --check-leaks --recursive --reporter spec test %s %s',
    program.key,
    program.blog
  ));

  exit(result.code);
};
