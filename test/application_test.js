/**
 * Implementation of the `akismet.tests.ApplicationTest` class.
 * @module test/applicaton_test
 */
const assert = require('assert');
const {Application} = require('../lib/server');

/**
 * Tests the features of the `Application` class.
 */
class ApplicationTest {

  /**
   * Runs the unit tests.
   */
  run() {
    let self = this;
    describe('Application', function() {
      describe('debug', self.testDebug);
      describe('env', self.testEnv);
    });
  }

  /**
   * Tests the `debug` property.
   */
  testDebug() {
    it('should be `false` in production environment', () => {
      process.env.NODE_ENV = 'production';
      assert.equal(new Application().debug, false);
    });

    it('should be `true` in development environment', () => {
      process.env.NODE_ENV = 'development';
      assert.equal(new Application().debug, true);
    });
  }

  /**
   * Tests the `env` property.
   */
  testEnv() {
    it('should be "production" if the NODE_ENV environment variable is not set', () => {
      delete process.env.NODE_ENV;
      assert.equal(new Application().env, 'production');
    });

    it('should equal the value of `NODE_ENV` environment variable when it is set', () => {
      process.env.NODE_ENV = 'development';
      assert.equal(new Application().env, 'development');
    });
  }
}

// Run all tests.
new ApplicationTest().run();
