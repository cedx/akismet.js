/**
 * Implementation of the `akismet.tests.ClientTest` class.
 * @module test/client_test
 */
const assert = require('assert');
const {Author, Client, Comment, CommentType} = require('../lib');

/**
 * Tests the features of the `Client` class.
 */
class ClientTest {

  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    /**
     * The client used to query the service database.
     * @type {Client}
     * @private
     */
    this._client = new Client(
      process.env.AKISMET_API_KEY,
      'AKISMET_BLOG' in process.env ? process.env.AKISMET_BLOG : 'https://github.com/cedx/akismet',
      {isTest: true, serviceURL: 'AKISMET_SERVICE_URL' in process.env ? process.env.AKISMET_SERVICE_URL : `https://${Client.DEFAULT_SERVICE}`}
    );

    /**
     * A comment with content marked as ham.
     * @type {Comment}
     * @private
     */
    this._ham = new Comment({
      author: new Author({
        ipAddress: '192.168.0.1',
        name: 'Akismet',
        url: 'https://github.com/cedx/akismet',
        userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0'
      }),
      content: 'I\'m testing out the Service API.',
      referrer: 'https://www.npmjs.com/package/akismet',
      type: CommentType.COMMENT
    });

    /**
     * A comment with content marked as spam.
     * @type {Comment}
     * @private
     */
    this._spam = new Comment({
      author: new Author({
        ipAddress: '127.0.0.1',
        name: 'viagra-test-123',
        userAgent: 'Spam Bot/6.6.6'
      }),
      content: 'Spam!',
      type: CommentType.TRACKBACK
    });
  }

  /**
   * Runs the unit tests.
   */
  run() {
    let self = this;
    describe('Client', function() {
      this.timeout(15000);
      describe('verifyKey()', self.testVerifyKey.bind(self));
      describe('submitHam()', self.testSubmitHam.bind(self));
      describe('submitSpam()', self.testSubmitSpam.bind(self));
      describe('checkComment()', self.testCheckComment.bind(self));
    });
  }

  /**
   * Tests the `checkComment` method.
   */
  testCheckComment() {
    it('should return `false` for valid comment (e.g. ham)' , () =>
      this._client.checkComment(this._ham).then(res => assert.equal(res, false))
    );

    it('should return `true` for invalid comment (e.g. spam)' , () =>
      this._client.checkComment(this._spam).then(res => assert.equal(res, true))
    );
  }

  /**
   * Tests the `submitHam` method.
   */
  testSubmitHam() {
    it('should complete without error' , () =>
      this._client.submitHam(this._ham)
    );
  }

  /**
   * Tests the `submitSpam` method.
   */
  testSubmitSpam() {
    it('should complete without error' , () =>
      this._client.submitSpam(this._spam)
    );
  }

  /**
   * Tests the `verifyKey` method.
   */
  testVerifyKey() {
    it('should return `true` for a valid API key' , () =>
      this._client.verifyKey().then(res => assert.equal(res, true))
    );

    it('should return `false` for an invalid API key' , () => {
      let client = new Client('viagra-test-123', this._client.blog, {
        isTest: this._client.isTest,
        serviceURL: this._client.serviceURL
      });

      return client.verifyKey().then(res => assert.equal(res, false));
    });
  }
}

// Run all tests.
new ClientTest().run();
