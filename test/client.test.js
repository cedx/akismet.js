import assert from 'assert';
import {Author, Client, Comment, CommentType} from '../src';

/**
 * The client used to query the service database.
 * @type {Client}
 */
let _client = new Client(
  process.env.AKISMET_API_KEY,
  'AKISMET_BLOG' in process.env ? process.env.AKISMET_BLOG : 'https://github.com/cedx/akismet',
  {isTest: true, serviceURL: 'AKISMET_SERVICE_URL' in process.env ? process.env.AKISMET_SERVICE_URL : `https://${Client.DEFAULT_SERVICE}`}
);

/**
 * A comment with content marked as ham.
 * @type {Comment}
 */
let _ham = new Comment({
  author: new Author({
    ipAddress: '192.168.0.1',
    name: 'Akismet',
    url: 'https://github.com/cedx/akismet',
    userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0'
  }),
  content: 'I\'m testing out the Service API.',
  referrer: 'https://www.npmjs.com/package/akismet',
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
   * @test {Client#verifyKey}
   */
  describe('verifyKey()', () => {
    it('should return `false` for valid comment (e.g. ham)' , () =>
      _client.checkComment(_ham).then(res => assert.equal(res, false))
    );

    it('should return `true` for invalid comment (e.g. spam)' , () =>
      _client.checkComment(_spam).then(res => assert.equal(res, true))
    );
  });

  /**
   * @test {Client#submitHam}
   */
  describe('submitHam()', () => {
    it('should complete without error' , () =>
      _client.submitHam(_ham)
    );
  });

  /**
   * @test {Client#submitSpam}
   */
  describe('submitSpam()', () => {
    it('should complete without error' , () =>
      _client.submitSpam(_spam)
    );
  });

  /**
   * @test {Client#verifyKey}
   */
  describe('verifyKey()', () => {
    it('should return `true` for a valid API key' , () =>
      _client.verifyKey().then(res => assert.equal(res, true))
    );

    it('should return `false` for an invalid API key' , () => {
      let client = new Client('viagra-test-123', _client.blog, {
        isTest: _client.isTest,
        serviceURL: _client.serviceURL
      });

      return client.verifyKey().then(res => assert.equal(res, false));
    });
  });
});
