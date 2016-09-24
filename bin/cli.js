#!/usr/bin/env node

/**
 * Command line interface.
 * @module bin/cli
 */
const {Application} = require('../lib/server');

// Run the application.
process.title = 'akismet';
global.app = new Application();
global.app.run();
