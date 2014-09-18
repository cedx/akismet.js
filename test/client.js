/**
 * Unit tests of the `client` module.
 * @module test.client
 */
'use strict';

// Module dependencies.
var assert=require('assert');
var env=global.process.env;

var Author=require('../lib/comment').Author;
var Blog=require('../lib/client').Blog;
var Client=require('../lib/client').Client;
var Comment=require('../lib/comment').Comment;
var CommentType=require('../lib/comment').CommentType;

/**
 * Tests the features of the `akismet.Blog` class.
 * @class tests.BlogTest
 * @static
 */
var BlogTest={

  /**
   * Runs the unit tests.
   * @method run
   */
  run: function() {
    var self=this;
    describe('Blog', function() {
      describe('.fromJSON()', self.testFromJSON);
      describe('#toJSON()', self.testToJSON);
    });
  },

  /**
   * Tests the `Author.fromJSON` method.
   * @method testFromJSON
   */
  testFromJSON: function() {
    it('should return a null reference with a non-object JSON string', function() {
      assert.strictEqual(Blog.fromJSON('foo'), null);
    });

    it('should return an empty instance with an empty JSON object', function() {
      var blog=Blog.fromJSON({});
      assert.strictEqual(blog.charset, null);
      assert.strictEqual(blog.lang, null);
      assert.strictEqual(blog.url, null);
    });

    it('should return an initialized instance with a non-empty JSON object', function() {
      var blog=Blog.fromJSON({ blog: 'http://dev.belin.io/akismet.js', blog_charset: 'UTF-8', blog_lang: 'en' });
      assert.equal(blog.charset, 'UTF-8');
      assert.equal(blog.lang, 'en');
      assert.equal(blog.url, 'http://dev.belin.io/akismet.js');
    });
  },

  /**
   * Tests the `Author#toJSON` method.
   * @method testToJSON
   */
  testToJSON: function() {
    it('should return an empty JSON object with a newly created instance', function() {
      assert.equal(new Blog().toJSON(), '{}');
    });

    it('should return a non-empty JSON object with a initialized instance', function() {
      var blog=new Blog('http://dev.belin.io/akismet.js', { charset: 'UTF-8', lang: 'en' });
      assert.equal(blog.toJSON(), '{"blog":"http://dev.belin.io/akismet.js","blog_charset":"UTF-8","blog_lang":"en"}');
    });
  }
};

/**
 * Tests the features of the `akismet.Client` class.
 * @class tests.ClientTest
 * @static
 */
var ClientTest={

  /**
   * The client used to query the service database.
   * @property _client
   * @type Client
   * @private
   */
  _client: new Client(
    env.AKISMET_API_KEY,
    env.AKISMET_BLOG,
    { serviceUrl: 'AKISMET_SERVICE_URL' in env ? env.AKISMET_SERVICE_URL : null }
  ),

  /**
   * A comment with content marked as ham.
   * @property _ham
   * @type Comment
   * @private
   */
  _ham: new Comment({
    author: new Author({
      ipAddress: '192.168.0.1',
      name: 'Akismet.js',
      url: 'http://dev.belin.io/akismet.js',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9) AppleWebKit/537.71 (KHTML, like Gecko) Version/7.0 Safari/537.71'
    }),
    content: 'I\'m testing out the Service API.',
    referrer: 'https://www.npmjs.org/package/akismet-js',
    type: CommentType.COMMENT
  }),

  /**
   * A comment with content marked as spam.
   * @property _spam
   * @type Comment
   * @private
   */
  _spam: new Comment({
    author: new Author({
      ipAddress: '127.0.0.1',
      name: 'viagra-test-123',
      userAgent: 'Spam Bot/6.6.6'
    }),
    content: 'Spam!',
    type: CommentType.TRACKBACK
  }),

  /**
   * Runs the unit tests.
   * @method run
   */
  run: function() {
    var self=this;
    describe('Client', function() {
      this.timeout(10000);
      describe('#verifyKey()', self.testVerifyKey.bind(self));
      describe('#submitHam()', self.testSubmitHam.bind(self));
      describe('#submitSpam()', self.testSubmitSpam.bind(self));
      describe('#checkComment()', self.testCheckComment.bind(self));
    });
  },

  /**
   * Tests the `checkComment` method.
   * @method testCheckComment
   */
  testCheckComment: function() {
    var self=this;
    it('should return `false` for valid comment (e.g. ham)' , function(done) {
      self._client.checkComment(self._ham, function(err, res) {
        assert.ifError(err);
        assert.strictEqual(res, false);
        done();
      });
    });

    it('should return `true` for invalid comment (e.g. spam)' , function(done) {
      self._client.checkComment(self._spam, function(err, res) {
        assert.ifError(err);
        assert.strictEqual(res, true);
        done();
      });
    });
  },

  /**
   * Tests the `submitHam` method.
   * @method testSubmitHam
   */
  testSubmitHam: function() {
    var self=this;
    it('should complete without error' , function(done) {
      self._client.submitHam(self._ham, done);
    });
  },

  /**
   * Tests the `submitSpam` method.
   * @method testSubmitSpam
   */
  testSubmitSpam: function() {
    var self=this;
    it('should complete without error' , function(done) {
      self._client.submitSpam(self._spam, done);
    });
  },

  /**
   * Tests the `verifyKey` method.
   * @method testVerifyKey
   */
  testVerifyKey: function() {
    var self=this;
    it('should return `true` for a valid API key' , function(done) {
      self._client.verifyKey(function(err, res) {
        assert.ifError(err);
        assert.strictEqual(res, true);
        done();
      });
    });

    it('should return `false` for an invalid API key' , function(done) {
      var client=new Client('viagra-test-123', self._client.blog, { serviceUrl: self._client.serviceUrl });
      client.verifyKey(function(err, res) {
        assert.ifError(err);
        assert.strictEqual(res, false);
        done();
      });
    });
  }
};

// Run all tests.
BlogTest.run();
ClientTest.run();
