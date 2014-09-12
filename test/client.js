/**
 * Unit tests of the `client` module.
 * @module tests.client
 */
'use strict';

// Module dependencies.
var assert=require('assert');
var akismet=require('../index');

var Author=akismet.Author;
var Client=akismet.Client;
var Comment=akismet.Comment;
var CommentType=akismet.CommentType;

/**
 * Tests the features of the `Client` class.
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
  _client: new Client('TODO: put your own Akismet API key', 'https://github.com/cedx/akismet.js'),

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
      url: 'https://github.com/cedx/akismet.js',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9) AppleWebKit/537.71 (KHTML, like Gecko) Version/7.0 Safari/537.71'
    }),
    content: 'I\'m testing out the Service API.',
    referrer: 'https://npmjs.org/package/akismet-js',
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
   * Tests the `Client#checkComment` method.
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
   * Tests the `Client#submitHam` method.
   * @method testSubmitHam
   */
  testSubmitHam: function() {
    var self=this;
    it('should complete without error' , function(done) {
      self._client.submitHam(self._ham, done);
    });
  },

  /**
   * Tests the `Client#submitSpam` method.
   * @method testSubmitSpam
   */
  testSubmitSpam: function() {
    var self=this;
    it('should complete without error' , function(done) {
      self._client.submitHam(self._spam, done);
    });
  },

  /**
   * Tests the `Client#verifyKey` method.
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
      new Client('viagra-test-123', 'http://fake-url.com').verifyKey(function(err, res) {
        assert.ifError(err);
        assert.strictEqual(res, false);
        done();
      });
    });

    it('should throw an error for an invalid blog URL' , function(done) {
      new Client('', 'mailto:viagra-test-123@fake-url.com').verifyKey(function(err) {
        assert(err instanceof Error);
        done();
      });
    });
  }
};

// Run all tests.
ClientTest.run();
