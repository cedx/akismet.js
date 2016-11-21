'use strict';

import assert from 'assert';
import {Author, Blog, Client, Comment, CommentType} from '../src/index';

/**
 * The client used to query the service database.
 * @type {Client}
 */
let _client = new Client({
  apiKey: process.env.AKISMET_API_KEY,
  blog: 'https://github.com/cedx/akismet.js',
  test: true
});

/**
 * A comment with content marked as ham.
 * @type {Comment}
 */
let _ham = new Comment({
  author: new Author({
    ipAddress: '192.168.0.1',
    name: 'Akismet',
    role: 'administrator',
    url: 'https://github.com/cedx/akismet.js',
    userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0'
  }),
  content: 'I\'m testing out the Service API.',
  referrer: 'https://www.npmjs.com/package/@cedx/akismet',
  type: CommentType.COMMENT
});

/**
 * A comment with content marked as spam.
 * @type {Comment}
 */
let _spam = new Comment({
  author: new Author({
    ipAddress: '127.0.0.1',
    name: 'viagra-test-123',
    userAgent: 'Spam Bot/6.6.6'
  }),
  content: 'Spam!',
  type: CommentType.TRACKBACK
});

/**
 * @test {Client}
 */
describe('Client', function() {
  this.timeout(15000);

  /**
   * @test {Client#constructor}
   */
  describe('#constructor()', () => {
    it('should initialize the existing properties', () => {
      let client = new Client({apiKey: '0123456789-ABCDEF', blog: 'https://github.com/cedx/akismet.js', userAgent: 'FooBar/6.6.6'});
      assert.equal(client.apiKey, '0123456789-ABCDEF');
      assert.equal(client.userAgent, 'FooBar/6.6.6');

      assert.ok(client.blog instanceof Blog);
      assert.equal(client.blog.url, 'https://github.com/cedx/akismet.js');
    });

    it('should not create new properties', () => {
      assert.ok(!('foo' in new Client({foo: 'bar'})));
    });
  });

  /**
   * @test {Client#checkComment}
   */
  describe('#checkComment()', () => {
    it('should return `false` for valid comment (e.g. ham)' , done => {
      _client.checkComment(_ham).subscribe(res => assert.equal(res, false), done, done);
    });

    it('should return `true` for invalid comment (e.g. spam)' , done => {
      _client.checkComment(_spam).subscribe(res => assert.equal(res, true), done, done);
    });
  });

  /**
   * @test {Client#submitHam}
   */
  describe('#submitHam()', () => {
    it('should complete without error' , done => {
      _client.submitHam(_ham).subscribe(null, done, done);
    });
  });

  /**
   * @test {Client#submitSpam}
   */
  describe('#submitSpam()', () => {
    it('should complete without error' , done => {
      _client.submitSpam(_spam).subscribe(null, done, done);
    });
  });

  /**
   * @test {Client#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return the right values for an incorrectly configured client' , () => {
      let data = new Client({apiKey: '0123456789-ABCDEF', userAgent: 'FooBar/6.6.6'}).toJSON();
      assert.equal(data.apiKey, '0123456789-ABCDEF');
      assert.strictEqual(data.blog, null);
      assert.ok(!data.test);
      assert.equal(data.userAgent, 'FooBar/6.6.6');
    });

    it('should return the right values for a properly configured client' , () => {
      let data = _client.toJSON();
      assert.equal(data.apiKey, process.env.AKISMET_API_KEY);
      assert.equal(data.blog, 'Blog');
      assert.ok(data.test);

      let version = `Node.js/${process.version}`;
      assert.equal(data.userAgent.substr(0, version.length), version);
    });
  });

  /**
   * @test {Client#verifyKey}
   */
  describe('#verifyKey()', () => {
    it('should return `true` for a valid API key' , done => {
      _client.verifyKey().subscribe(res => assert.equal(res, true), done, done);
    });

    it('should return `false` for an invalid API key' , done => {
      let client = new Client({apiKey: '0123456789-ABCDEF', blog: _client.blog, test: _client.test});
      client.verifyKey().subscribe(res => assert.equal(res, false), done, done);
    });
  });
});
