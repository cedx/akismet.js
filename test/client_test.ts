/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {Author, Blog, Client, Comment, CommentType} from '../src';

/** Tests the features of the [[Client]] class. */
describe('Client', function() {
  this.timeout(15000);

  /** The default test client. */
  const _client: Client = new Client(process.env.AKISMET_API_KEY!, new Blog(new URL('https://dev.belin.io/akismet.js')), {isTest: true});

  /** A message marked as ham. */
  const _ham: Comment = new Comment(
    new Author('192.168.0.1', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:66.0) Gecko/20100101 Firefox/66.0', {
      name: 'Akismet',
      role: 'administrator',
      url: new URL('https://dev.belin.io/akismet.js')
    }), {
    content: 'I\'m testing out the Service API.',
    referrer: new URL('https://www.npmjs.com/package/@cedx/akismet'),
    type: CommentType.comment
  });

  /** A message marked as spam. */
  const _spam: Comment = new Comment(
    new Author('127.0.0.1', 'Spam Bot/6.6.6', {
      email: 'akismet-guaranteed-spam@example.com',
      name: 'viagra-test-123'
    }), {
    content: 'Spam!',
    type: CommentType.trackback
  });

  /** Tests the `Client#checkComment()` method. */
  describe('CheckComment()', () => {
    it('should return `false` for valid comment (e.g. ham)' , async () => {
      expect(await _client.checkComment(_ham)).to.be.false;
    });

    it('should return `true` for invalid comment (e.g. spam)' , async () => {
      expect(await _client.checkComment(_spam)).to.be.true;
    });
  });

  /** Tests the `Client#submitHam()` method. */
  describe('SubmitHam()', () => {
    it('should complete without error' , async () => {
      await _client.submitHam(_ham);
      expect(true).to.be.ok;
    });
  });

  /** Tests the `Client#submitSpam()` method. */
  describe('SubmitSpam()', () => {
    it('should complete without error' , async () => {
      await _client.submitSpam(_spam);
      expect(true).to.be.ok;
    });
  });

  /** Tests the `Client#verifyKey()` method. */
  describe('VerifyKey()', () => {
    it('should return `true` for a valid API key' , async () => {
      expect(await _client.verifyKey()).to.be.true;
    });

    it('should return `false` for an invalid API key' , async () => {
      const client = new Client('0123456789-ABCDEF', _client.blog, {isTest: _client.isTest});
      expect(await client.verifyKey()).to.be.false;
    });
  });
});
