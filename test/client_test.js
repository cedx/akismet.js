'use strict';

import {expect} from 'chai';
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
    it('should return `false` for valid comment (e.g. ham)' , async () =>
      expect(await _client.checkComment(ham)).to.be.false
    );

    it('should return `true` for invalid comment (e.g. spam)' , async () =>
      expect(await _client.checkComment(spam)).to.be.true
    );
  });

  /**
   * @test {Client#onRequest}
   */
  describe('#onRequest', () => {
    it('should return an `Observable` instead of the underlying `Subject`', () => {
      let stream = new Client().onRequest;
      expect(stream).to.be.instanceof(Observable);
      expect(stream).to.not.be.instanceof(Subject);
    });
  });

  /**
   * @test {Client#onResponse}
   */
  describe('#onResponse', () => {
    it('should return an `Observable` instead of the underlying `Subject`', () => {
      let stream = new Client().onResponse;
      expect(stream).to.be.instanceof(Observable);
      expect(stream).to.not.be.instanceof(Subject);
    });
  });

  /**
   * @test {Client#submitHam}
   */
  describe('#submitHam()', () => {
    it('should complete without error' , async () => {
      await _client.submitHam(ham);
      expect(true).to.be.ok;
    });
  });

  /**
   * @test {Client#submitSpam}
   */
  describe('#submitSpam()', () => {
    it('should complete without error' , async () => {
      await _client.submitSpam(spam);
      expect(true).to.be.ok;
    });
  });

  /**
   * @test {Client#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return the right values for an incorrectly configured client' , () => {
      let client = new Client('0123456789-ABCDEF');
      client.endPoint = 'http://localhost';
      client.userAgent = 'FooBar/6.6.6';

      let data = client.toJSON();
      expect(data.apiKey).to.equal('0123456789-ABCDEF');
      expect(data.blog).to.be.null;
      expect(data.endPoint).to.equal('http://localhost');
      expect(data.isTest).to.be.false;
      expect(data.userAgent).to.equal('FooBar/6.6.6');
    });

    it('should return the right values for a properly configured client' , () => {
      let data = _client.toJSON();
      expect(data.apiKey).to.equal(process.env.AKISMET_API_KEY);
      expect(data.blog).to.equal('Blog');
      expect(data.endPoint).to.equal(Client.DEFAULT_ENDPOINT);
      expect(data.isTest).to.be.true;

      let version = `Node.js/${process.version.substr(1)}`;
      expect(data.userAgent.indexOf(version)).to.equal(0);
    });
  });

  /**
   * @test {Client#toString}
   */
  describe('#toString()', () => {
    let data = String(_client);

    it('should start with the class name', () => {
      expect(data.indexOf('Client {')).to.equal(0);
    });

    it('should contain the instance properties', () => {
      expect(data).to.contain('"apiKey":"');
      expect(data).to.contain('"blog":"Blog"');
      expect(data).to.contain(`"endPoint":"${Client.DEFAULT_ENDPOINT}"`);
      expect(data).to.contain('"isTest":true');
      expect(data).to.contain('"userAgent":"Node.js/');
    });
  });

  /**
   * @test {Client#verifyKey}
   */
  describe('#verifyKey()', () => {
    it('should return `true` for a valid API key' , async () =>
      expect(await _client.verifyKey()).to.be.true
    );

    it('should return `false` for an invalid API key' , async () => {
      let client = new Client('0123456789-ABCDEF', _client.blog);
      client.isTest = _client.isTest;
      expect(await client.verifyKey()).to.be.false;
    });
  });
});
