/**
 * Unit tests of the `server` module.
 * @module test.server_test
 */
'use strict';

// Module dependencies.
const assert=require('assert');
const Server=require('../lib/server');

/**
 * Tests the features of the `akismet.Server` class.
 */
class ServerTest {

  /**
   * Runs the unit tests.
   */
  run() {
    let self=this;
    describe('Server', function() {
      describe('fromJSON()', self.testFromJSON);
      describe('toJSON()', self.testToJSON);
    });
  }

  /**
   * Tests the `fromJSON` method.
   */
  testFromJSON() {
  }

  /**
   * Tests the `toJSON` method.
   */
  testToJSON() {
  }
}

// Run all tests.
new ServerTest().run();
