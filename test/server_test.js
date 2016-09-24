/**
 * Implementation of the `akismet.tests.ServerTest` class.
 * @module test/server_test
 */
const assert = require('assert');
const {Server} = require('../lib/server');

/**
 * Tests the features of the `Server` class.
 */
class ServerTest {

  /**
   * Runs the unit tests.
   */
  run() {
    describe('Server', () => {
      describe('address', this.testAddress);
      describe('port', this.testPort);
      describe('redirectURL', this.testRedirectURL);

      describe('checkComment()', this.testCheckComment);
      describe('submitHam()', this.testSubmitHam);
      describe('submitSpam()', this.testSubmitSpam);
      describe('verifyKey()', this.testVerifyKey);
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
   * Tests the `address` property.
   */
  testAddress() {
    it('should have an "any IPv4" address as the default address', () =>
      assert.equal(new Server().address, Server.DEFAULT_ADDRESS)
    );

    it('should have the same host as the specified one', () =>
      assert.equal(new Server({address: 'localhost'}).address, 'localhost')
    );
  }

  /**
   * Tests the `port` property.
   */
  testPort() {
    it('should have 3000 as the default port', () =>
      assert.equal(new Server().port, Server.DEFAULT_PORT)
    );

    it('should have the same port as the specified one', () =>
      assert.equal(new Server({port: 8080}).port, 8080)
    );
  }

  /**
   * Tests the `redirectURL` property.
   */
  testRedirectURL() {
    it('should have an empty string as the default redirect URL', () =>
      assert(!new Server().redirectURL.length)
    );

    it('should have the same redirect URL as the specified one', () =>
      assert.equal(new Server({redirectURL: 'https://www.belin.io'}).redirectURL, 'https://www.belin.io')
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
