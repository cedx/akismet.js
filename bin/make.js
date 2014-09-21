#!/usr/bin/env node
/* global cd, config, cp, echo, env, exec, exit, target */

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
  target.css();
  echo('Done.');

  target.js();
  echo('Done.');
};

/**
 * Builds the stylesheets.
 * @method css
 */
target.css=function() {
  echo('Build the stylesheets...');
  cp('-f', require.resolve('mocha/mocha.css'), 'www/css');
};

/**
 * Builds the documentation.
 * @method doc
 */
target.doc=function() {
  echo('Build the documentation...');
  exec('docgen');
  cp('-f', [ 'www/apple-touch-icon.png', 'www/favicon.ico' ], 'doc/api/assets');
};

/**
 * Builds the client scripts.
 * @method js
 */
target.js=function() {
  echo('Build the client scripts...');
  exec('browserify www/js/main.js --debug --outfile www/js/tests.js');
  exec('uglifyjs www/js/tests.js --compress --mangle --output www/js/tests.min.js --screw-ie8');
  exec(util.format('uglifyjs "%s" --compress --mangle --output www/js/mocha.js --screw-ie8', require.resolve('mocha/mocha.js')));
};

/**
 * Performs static analysis of source code.
 * @method lint
 */
target.lint=function() {
  config.fatal=false;

  echo('Static analysis of source code...');
  exec('jshint --verbose bin lib test www/js/main.js');

  echo('Static analysis of documentation comments...');
  exec('docgen --lint');

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
    .option('-b, --blog <url>', 'the front page or home URL [http://dev.belin.io/akismet.js]', 'http://dev.belin.io/akismet.js')
    .parse(process.argv);

  if(!program.key) program.help();

  echo('Run the unit tests...');
  env.AKISMET_API_KEY=program.key;
  env.AKISMET_BLOG=program.blog;

  var result=exec('mocha --check-leaks --recursive --reporter spec');
  exit(result.code);
};
