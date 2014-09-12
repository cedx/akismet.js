/**
 * Unit tests of the `client` module.
 * @module tests.client
 */
'use strict';

// Module dependencies.
var assert=require('assert');
var Author=require('../index').Author;
var Client=require('../index').Client;
var Comment=require('../index').Comment;
var CommentType=require('../index').CommentType;

/**
 * Tests the features of the `akismet.Client` class.
 * @class akismet.tests.ClientTest
 * @static
 */
var ClientTest={

  /**
   * The client used to query the service database.
   * @property _client
   * @type Client
   * @private
   */
  _client: new Client(process.env.AKISMET_API_KEY, process.env.AKISMET_BLOG),

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
      self._client.submitHam(self._spam, done);
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
      new Client('viagra-test-123', self._client.blog).verifyKey(function(err, res) {
        assert.ifError(err);
        assert.strictEqual(res, false);
        done();
      });
    });
  }
};

// Run all tests.
ClientTest.run();
