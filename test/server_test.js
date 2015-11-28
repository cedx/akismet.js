/**
 * Unit tests of the `server` module.
 * @module test.server_test
 */
'use strict';

// Module dependencies.
const assert=require('assert');
const Server=require('../lib/server');

/**
 * Tests the features of the `Server` class.
 */
class ServerTest {

  /**
   * Runs the unit tests.
   */
  run() {
    let self=this;
    describe('Server', function() {
      describe('host', self.testHost);
      describe('port', self.testPort);
      describe('redirectUrl', self.testRedirectUrl);

      describe('checkComment()', self.testCheckComment);
      describe('submitHam()', self.testSubmitHam);
      describe('submitSpam()', self.testSubmitSpam);
      describe('verifyKey()', self.testVerifyKey);
    });
  }

  /**
   * Tests the `checkComment` method.
   */
  testCheckComment() {
    it('should throw an error if the request has no "akismet" property', () =>
      assert.throws(() => new Server().checkComment({}, null))
    );
  }

  /**
   * Tests the `host` property.
   */
  testHost() {
    it('should have an "any IPv4" address as the default host', () =>
      assert.equal(new Server().host, '0.0.0.0')
    );

    it('should have the same host as the specified one', () =>
      assert.equal(new Server({host: 'localhost'}).host, 'localhost')
    );
  }

  /**
   * Tests the `port` property.
   */
  testPort() {
    it('should have 3000 as the default port', () =>
      assert.equal(new Server().port, 3000)
    );

    it('should have the same port as the specified one', () =>
      assert.equal(new Server({port: 8080}).port, 8080)
    );
  }

  /**
   * Tests the `redirectUrl` property.
   */
  testRedirectUrl() {
    it('should have a null reference as the default redirect URL', () =>
      assert.strictEqual(new Server().redirectUrl, null)
    );

    it('should have the same redirect URL as the specified one', () =>
      assert.equal(new Server({redirectUrl: 'http://www.belin.io'}).redirectUrl, 'http://www.belin.io')
    );
  }

  /**
   * Tests the `submitHam` method.
   */
  testSubmitHam() {
    it('should throw an error if the request has no "akismet" property', () =>
      assert.throws(() => new Server().submitHam({}, null))
    );
  }

  /**
   * Tests the `submitSpam` method.
   */
  testSubmitSpam() {
    it('should throw an error if the request has no "akismet" property', () =>
      assert.throws(() => new Server().submitSpam({}, null))
    );
  }

  /**
   * Tests the `verifyKey` method.
   */
  testVerifyKey() {
    it('should throw an error if the request has no "akismet" property', () =>
      assert.throws(() => new Server().verifyKey({}, null))
    );
  }
}

// Run all tests.
new ServerTest().run();
