/**
 * Unit tests of the `client` module.
 * @module test.client_test
 */
'use strict';

// Module dependencies.
var assert=require('assert');
var clt=require('../lib/client');
var cmt=require('../lib/comment');

/**
 * Tests the features of the `akismet.Blog` class.
 * @class akismet.tests.BlogTest
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
      describe('fromJSON()', self.testFromJSON);
      describe('toJSON()', self.testToJSON);
    });
  },

  /**
   * Tests the `fromJSON` method.
   * @method testFromJSON
   */
  testFromJSON: function() {
    it('should return a null reference with a non-object JSON string', function() {
      assert.strictEqual(clt.Blog.fromJSON('foo'), null);
    });

    it('should return an empty instance with an empty JSON object', function() {
      var blog=clt.Blog.fromJSON('{}');
      assert.strictEqual(blog.charset, null);
      assert.strictEqual(blog.language, null);
      assert.strictEqual(blog.url, null);
    });

    it('should return an initialized instance with a non-empty JSON object', function() {
      var blog=clt.Blog.fromJSON('{ "blog": "https://bitbucket.org/cedx/akismet.js", "blog_charset": "UTF-8", "blog_lang": "en" }');
      assert.equal(blog.charset, 'UTF-8');
      assert.equal(blog.language, 'en');
      assert.equal(blog.url, 'https://bitbucket.org/cedx/akismet.js');
    });
  },

  /**
   * Tests the `toJSON` method.
   * @method testToJSON
   */
  testToJSON: function() {
    it('should return an empty JSON object with a newly created instance', function() {
      assert.equal(new clt.Blog().toJSON(), '{}');
    });

    it('should return a non-empty JSON object with a initialized instance', function() {
      var blog=new clt.Blog('https://bitbucket.org/cedx/akismet.js', { charset: 'UTF-8', language: 'en' });
      assert.equal(blog.toJSON(), '{"blog":"https://bitbucket.org/cedx/akismet.js","blog_charset":"UTF-8","blog_lang":"en"}');
    });
  }
};

/**
 * Tests the features of the `akismet.Client` class.
 * @class akismet.tests.ClientTest
 * @static
 */
var ClientTest={

  /**
   * The client used to query the service database.
   * @property _client
   * @type akismet.Client
   * @private
   */
  _client: new clt.Client(
    process.env.AKISMET_API_KEY,
    'AKISMET_BLOG' in process.env ? process.env.AKISMET_BLOG : 'https://bitbucket.org/cedx/akismet.js',
    { isTest: true, serviceUrl: 'AKISMET_SERVICE_URL' in process.env ? process.env.AKISMET_SERVICE_URL : 'https://'+clt.Client.DEFAULT_SERVICE }
  ),

  /**
   * A comment with content marked as ham.
   * @property _ham
   * @type akismet.Comment
   * @private
   */
  _ham: new cmt.Comment({
    author: new cmt.Author({
      ipAddress: '192.168.0.1',
      name: 'Akismet.js',
      url: 'https://bitbucket.org/cedx/akismet.js',
      userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko'
    }),
    content: 'I\'m testing out the Service API.',
    referrer: 'https://www.npmjs.com/package/akismet-js',
    type: cmt.CommentType.COMMENT
  }),

  /**
   * A comment with content marked as spam.
   * @property _spam
   * @type akismet.Comment
   * @private
   */
  _spam: new cmt.Comment({
    author: new cmt.Author({
      ipAddress: '127.0.0.1',
      name: 'viagra-test-123',
      userAgent: 'Spam Bot/6.6.6'
    }),
    content: 'Spam!',
    type: cmt.CommentType.TRACKBACK
  }),

  /**
   * Runs the unit tests.
   * @method run
   */
  run: function() {
    var self=this;
    describe('Client', function() {
      this.timeout(10000);
      describe('verifyKey()', self.testVerifyKey.bind(self));
      describe('submitHam()', self.testSubmitHam.bind(self));
      describe('submitSpam()', self.testSubmitSpam.bind(self));
      describe('checkComment()', self.testCheckComment.bind(self));
    });
  },

  /**
   * Tests the `checkComment` method.
   * @method testCheckComment
   */
  testCheckComment: function() {
    var self=this;
    it('should return `false` for valid comment (e.g. ham)' , function(done) {
      self._client.checkComment(self._ham).then(
        function(res) { assert.strictEqual(res, false); done(); },
        done
      );
    });

    it('should return `true` for invalid comment (e.g. spam)' , function(done) {
      self._client.checkComment(self._spam).then(
        function(res) { assert.strictEqual(res, true); done(); },
        done
      );
    });
  },

  /**
   * Tests the `submitHam` method.
   * @method testSubmitHam
   */
  testSubmitHam: function() {
    var self=this;
    it('should complete without error' , function(done) {
      self._client.submitHam(self._ham).then(
        function() { done(); },
        done
      );
    });
  },

  /**
   * Tests the `submitSpam` method.
   * @method testSubmitSpam
   */
  testSubmitSpam: function() {
    var self=this;
    it('should complete without error' , function(done) {
      self._client.submitSpam(self._spam).then(
        function() { done(); },
        done
      );
    });
  },

  /**
   * Tests the `verifyKey` method.
   * @method testVerifyKey
   */
  testVerifyKey: function() {
    var self=this;
    it('should return `true` for a valid API key' , function(done) {
      self._client.verifyKey().then(
        function(res) { assert.strictEqual(res, true); done(); },
        done
      );
    });

    it('should return `false` for an invalid API key' , function(done) {
      var client=new clt.Client('viagra-test-123', self._client.blog, { isTest: self._client.isTest, serviceUrl: self._client.serviceUrl });
      client.verifyKey().then(
        function(res) { assert.strictEqual(res, false); done(); },
        done
      );
    });
  }
};

// Run all tests.
BlogTest.run();
ClientTest.run();
