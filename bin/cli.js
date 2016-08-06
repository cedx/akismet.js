#!/usr/bin/env node

/**
 * Command line interface.
 * @module bin/cli
 */
'use strict';
const {Application} = require('../lib/server');

// Run the application.
let application = new Application();

if(module === require.main) {
  process.title = 'akismet';
  global.app = application;
  global.app.run();
}

// Public interface.
module.exports = application;
