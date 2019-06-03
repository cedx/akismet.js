import chai from 'chai';
import {Author, Blog, Client, Comment, CommentType} from '../lib/index.js';

/** Tests the features of the {@link Client} class. */
describe('Client', function() {
  const {expect} = chai;
  this.timeout(15000); // eslint-disable-line no-invalid-this

  // The default test client.
  const _client = new Client(process.env.AKISMET_API_KEY, new Blog(new URL('https://dev.belin.io/akismet.js')), {isTest: true});

  // A message marked as ham.
  let author = new Author('192.168.0.1', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0', {
    name: 'Akismet',
    role: 'administrator',
    url: new URL('https://dev.belin.io/akismet.js')
  });

  const _ham = new Comment(author, {
    content: 'I\'m testing out the Service API.',
    referrer: new URL('https://www.npmjs.com/package/@cedx/akismet'),
    type: CommentType.comment
  });

  // A message marked as spam.
  author = new Author('127.0.0.1', 'Spam Bot/6.6.6', {
    email: 'akismet-guaranteed-spam@example.com',
    name: 'viagra-test-123'
  });

  const _spam = new Comment(author, {
    content: 'Spam!',
    type: CommentType.trackback
  });

  describe('#checkComment()', () => {
    it('should return `false` for valid comment (e.g. ham)', async () => {
      expect(await _client.checkComment(_ham)).to.be.false;
    });

    it('should return `true` for invalid comment (e.g. spam)', async () => {
      expect(await _client.checkComment(_spam)).to.be.true;
    });
  });

  describe('#submitHam()', () => {
    it('should complete without error', async () => {
      await _client.submitHam(_ham);
      expect(true).to.be.ok;
    });
  });

  describe('#submitSpam()', () => {
    it('should complete without error', async () => {
      await _client.submitSpam(_spam);
      expect(true).to.be.ok;
    });
  });

  describe('#verifyKey()', () => {
    it('should return `true` for a valid API key', async () => {
      expect(await _client.verifyKey()).to.be.true;
    });

    it('should return `false` for an invalid API key', async () => {
      const client = new Client('0123456789-ABCDEF', _client.blog, {isTest: _client.isTest});
      expect(await client.verifyKey()).to.be.false;
    });
  });
});
