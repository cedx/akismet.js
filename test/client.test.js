'use strict';

const {expect} = require('chai');
const {Author, Client, Comment, CommentType} = require('../lib');
const {URL} = require('../lib/url');

const isBrowser = typeof window == 'object' && typeof document == 'object' && document.nodeType == 9;
const onNodeDescribe = isBrowser ? describe.skip : describe;

/**
 * @test {Client}
 */
onNodeDescribe('Client', function() {
  this.timeout(15000);

  let _client = new Client(process.env.AKISMET_API_KEY, 'https://github.com/cedx/akismet.js');
  _client.isTest = true;

  let author = new Author('192.168.0.1', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0');
  author.name = 'Akismet';
  author.role = 'administrator';
  author.url = new URL('https://github.com/cedx/akismet.js');

  let ham = new Comment(author, 'I\'m testing out the Service API.', CommentType.comment);
  ham.referrer = new URL('https://www.npmjs.com/package/@cedx/akismet');

  author = new Author('127.0.0.1', 'Spam Bot/6.6.6');
  author.name = 'viagra-test-123';

  let spam = new Comment(author, 'Spam!', CommentType.trackback);

  /**
   * @test {Client#checkComment}
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
   * @test {Client#verifyKey}
   */
  describe('#verifyKey()', () => {
    it('should return `true` for a valid API key' , async () => {
      expect(await _client.verifyKey()).to.be.true;
    });

    it('should return `false` for an invalid API key' , async () => {
      let client = new Client('0123456789-ABCDEF', _client.blog);
      client.isTest = _client.isTest;
      expect(await client.verifyKey()).to.be.false;
    });
  });
});
