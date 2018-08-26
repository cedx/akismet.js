/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import {Author, Client, Comment, CommentType} from '../src';

/**
 * Tests the `Client}
 */
describe('Client', function() {
  this.timeout(15000);
  const _client = new Client(process.env.AKISMET_API_KEY, 'https://dev.belin.io/akismet.js', {isTest: true});

  const author = new Author('192.168.0.1', 'Mozilla/5.0 (X11; Linux x86_64) Chrome/66.0.3359.139', {
    name: 'Akismet',
    role: 'administrator',
    url: 'https://dev.belin.io/akismet.js'
  });

  const ham = new Comment(author, {
    content: 'I\'m testing out the Service API.',
    referrer: 'https://www.npmjs.com/package/@cedx/akismet',
    type: CommentType.comment
  });

  author = new Author('127.0.0.1', 'Spam Bot/6.6.6', {
    email: 'akismet-guaranteed-spam@example.com',
    name: 'viagra-test-123'
  });

  const spam = new Comment(author, {
    content: 'Spam!',
    type: CommentType.trackback
  });

  /**
   * Tests the `Client#checkComment}
   */
  describe('#checkComment()', () => {
    it('should return `false` for valid comment (e.g. ham)' , async () => {
      expect(await _client.checkComment(ham)).to.be.false;
    });

    it('should return `true` for invalid comment (e.g. spam)' , async () => {
      expect(await _client.checkComment(spam)).to.be.true;
    });
  });

  /**
   * Tests the `Client#submitHam}
   */
  describe('#submitHam()', () => {
    it('should complete without error' , async () => {
      await _client.submitHam(ham);
      expect(true).to.be.ok;
    });
  });

  /**
   * Tests the `Client#submitSpam}
   */
  describe('#submitSpam()', () => {
    it('should complete without error' , async () => {
      await _client.submitSpam(spam);
      expect(true).to.be.ok;
    });
  });

  /**
   * Tests the `Client#verifyKey}
   */
  describe('#verifyKey()', () => {
    it('should return `true` for a valid API key' , async () => {
      expect(await _client.verifyKey()).to.be.true;
    });

    it('should return `false` for an invalid API key' , async () => {
      const client = new Client('0123456789-ABCDEF', _client.blog, {isTest: _client.isTest});
      expect(await client.verifyKey()).to.be.false;
    });
  });
});
