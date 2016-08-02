/**
 * Unit tests of the `client` module.
 * @module test.client_test
 */
'use strict';

// Module dependencies.
const assert=require('assert');
const clt=require('../lib/client');
const cmt=require('../lib/comment');

/**
 * Tests the features of the `Blog` class.
 */
class BlogTest {

  /**
   * Runs the unit tests.
   */
  run() {
    let self=this;
    describe('Blog', function() {
      describe('constructor()', self.testConstructor);
      describe('fromJSON()', self.testFromJSON);
      describe('toJSON()', self.testToJSON);
    });
  }

  /**
   * Tests the constructor.
   */
  testConstructor() {
    it('should initialize the existing properties', () => {
      let blog=new clt.Blog('https://github.com/cedx/akismet', {charset: 'UTF-8', language: 'en'});
      assert.equal(blog.charset, 'UTF-8');
      assert.equal(blog.language, 'en');
      assert.equal(blog.url, 'https://github.com/cedx/akismet');
    });

    it('should not create new properties', () =>
      assert(!('foo' in new clt.Blog('https://github.com/cedx/akismet', {foo: 'bar'})))
    );
  }

  /**
   * Tests the `fromJSON` method.
   */
  testFromJSON() {
    it('should return a null reference with a non-object JSON string', () =>
      assert.strictEqual(clt.Blog.fromJSON('foo'), null)
    );

    it('should return an empty instance with an empty JSON object', () => {
      let blog=clt.Blog.fromJSON('{}');
      assert.strictEqual(blog.charset, null);
      assert.strictEqual(blog.language, null);
      assert.strictEqual(blog.url, null);
    });

    it('should return an initialized instance with a non-empty JSON object', () => {
      let blog=clt.Blog.fromJSON('{ "blog": "https://github.com/cedx/akismet", "blog_charset": "UTF-8", "blog_lang": "en" }');
      assert.equal(blog.charset, 'UTF-8');
      assert.equal(blog.language, 'en');
      assert.equal(blog.url, 'https://github.com/cedx/akismet');
    });
  }

  /**
   * Tests the `toJSON` method.
   */
  testToJSON() {
    it('should return an empty JSON object with a newly created instance', () =>
      assert.equal(new clt.Blog().toJSON(), '{}')
    );

    it('should return a non-empty JSON object with a initialized instance', () => {
      let blog=new clt.Blog('https://github.com/cedx/akismet', {charset: 'UTF-8', language: 'en'});
      assert.equal(blog.toJSON(), '{"blog":"https://github.com/cedx/akismet","blog_charset":"UTF-8","blog_lang":"en"}');
    });
  }
}

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
     * @var {Client}
     * @private
     */
    this._client=new clt.Client(
      process.env.AKISMET_API_KEY,
      'AKISMET_BLOG' in process.env ? process.env.AKISMET_BLOG : 'https://github.com/cedx/akismet',
      {isTest: true, serviceUrl: 'AKISMET_SERVICE_URL' in process.env ? process.env.AKISMET_SERVICE_URL : 'https://'+clt.Client.DEFAULT_SERVICE}
    );

    /**
     * A comment with content marked as ham.
     * @var {Comment}
     * @private
     */
    this._ham=new cmt.Comment({
      author: new cmt.Author({
        ipAddress: '192.168.0.1',
        name: 'Akismet',
        url: 'https://github.com/cedx/akismet',
        userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0'
      }),
      content: 'I\'m testing out the Service API.',
      referrer: 'https://www.npmjs.com/package/akismet',
      type: cmt.CommentType.COMMENT
    });

    /**
     * A comment with content marked as spam.
     * @var {Comment}
     * @private
     */
    this._spam=new cmt.Comment({
      author: new cmt.Author({
        ipAddress: '127.0.0.1',
        name: 'viagra-test-123',
        userAgent: 'Spam Bot/6.6.6'
      }),
      content: 'Spam!',
      type: cmt.CommentType.TRACKBACK
    });
  }

  /**
   * Runs the unit tests.
   */
  run() {
    let self=this;
    describe('Client', function() {
      this.timeout(10000);
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
      this._client.checkComment(this._ham).then(res => assert.strictEqual(res, false))
    );

    it('should return `true` for invalid comment (e.g. spam)' , () =>
      this._client.checkComment(this._spam).then(res => assert.strictEqual(res, true))
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
      this._client.verifyKey().then(res => assert.strictEqual(res, true))
    );

    it('should return `false` for an invalid API key' , () => {
      let client=new clt.Client('viagra-test-123', this._client.blog, {
        isTest: this._client.isTest,
        serviceUrl: this._client.serviceUrl
      });

      return client.verifyKey().then(res => assert.strictEqual(res, false));
    });
  }
}

// Run all tests.
new BlogTest().run();
new ClientTest().run();
