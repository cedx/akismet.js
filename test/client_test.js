'use strict';

import assert from 'assert';
import {Author, Client, Comment, CommentType} from '../src/index';
import {Observable, Subject} from 'rxjs';

/**
 * @test {Client}
 */
describe('Client', function() {
  this.timeout(15000);

  let _client = new Client(process.env.AKISMET_API_KEY, 'https://github.com/cedx/akismet.js');
  _client.isTest = true;

  let author = new Author('192.168.0.1', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0');
  author.name = 'Akismet';
  author.role = 'administrator';
  author.url = 'https://github.com/cedx/akismet.js';

  let ham = new Comment(author, 'I\'m testing out the Service API.', CommentType.COMMENT);
  ham.referrer = 'https://www.npmjs.com/package/@cedx/akismet';

  author = new Author('127.0.0.1', 'Spam Bot/6.6.6');
  author.name = 'viagra-test-123';

  let spam = new Comment(author, 'Spam!', CommentType.TRACKBACK);

  /**
   * @test {Client#checkComment}
   */
  describe('#checkComment()', () => {
    it('should return `false` for valid comment (e.g. ham)' , () =>
      _client.checkComment(ham).then(res => assert.equal(res, false))
    );

    it('should return `true` for invalid comment (e.g. spam)' , () =>
      _client.checkComment(spam).then(res => assert.equal(res, true))
    );
  });

  /**
   * @test {Client#onRequest}
   */
  describe('#onRequest', () => {
    it('should return an Observable instead of the underlying Subject', () => {
      let stream = new Client().onRequest;
      assert.ok(stream instanceof Observable);
      assert.ok(!(stream instanceof Subject));
    });
  });

  /**
   * @test {Client#onResponse}
   */
  describe('#onResponse', () => {
    it('should return an Observable instead of the underlying Subject', () => {
      let stream = new Client().onResponse;
      assert.ok(stream instanceof Observable);
      assert.ok(!(stream instanceof Subject));
    });
  });

  /**
   * @test {Client#submitHam}
   */
  describe('#submitHam()', () => {
    it('should complete without error' , () =>
      _client.submitHam(ham).then(() => assert.ok(true))
    );
  });

  /**
   * @test {Client#submitSpam}
   */
  describe('#submitSpam()', () => {
    it('should complete without error' , () =>
      _client.submitSpam(spam).then(() => assert.ok(true))
    );
  });

  /**
   * @test {Client#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return the right values for an incorrectly configured client' , () => {
      let client = new Client('0123456789-ABCDEF');
      client.userAgent = 'FooBar/6.6.6';

      let data = client.toJSON();
      assert.equal(data.apiKey, '0123456789-ABCDEF');
      assert.strictEqual(data.blog, null);
      assert.ok(!data.isTest);
      assert.equal(data.userAgent, 'FooBar/6.6.6');
    });

    it('should return the right values for a properly configured client' , () => {
      let data = _client.toJSON();
      assert.equal(data.apiKey, process.env.AKISMET_API_KEY);
      assert.equal(data.blog, 'Blog');
      assert.ok(data.isTest);

      let version = `Node.js/${process.version.substr(1)}`;
      assert.equal(data.userAgent.substr(0, version.length), version);
    });
  });

  /**
   * @test {Client#toString}
   */
  describe('#toString()', () => {
    let data = String(_client);

    it('should start with the constructor name', () => {
      assert.equal(data.indexOf('Client {'), 0);
    });

    it('should contain the instance properties', () => {
      assert.ok(data.includes('"apiKey":"'));
      assert.ok(data.includes('"blog":{'));
      assert.ok(data.includes('"isTest":true'));
      assert.ok(data.includes('"userAgent":"Node.js/'));
    });
  });

  /**
   * @test {Client#verifyKey}
   */
  describe('#verifyKey()', () => {
    it('should return `true` for a valid API key' , () =>
      _client.verifyKey().then(res => assert.equal(res, true))
    );

    it('should return `false` for an invalid API key' , () => {
      let client = new Client('0123456789-ABCDEF', _client.blog);
      client.isTest = _client.isTest;
      return client.verifyKey().then(res => assert.equal(res, false));
    });
  });
});
