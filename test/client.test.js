import assert from 'assert';
import {Author, Blog, Client, Comment, CommentType} from '../src/index';

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
   * @test {Client#constructor}
   */
  describe('#constructor()', () => {
    it('should initialize the existing properties', () => {
      let client = new Client('0123456789ABCDEF', 'https://github.com/cedx/akismet');
      assert.equal(client.apiKey, '0123456789ABCDEF');
      assert(client.blog instanceof Blog);
    });

    it('should not create new properties', () =>
      assert(!('foo' in new Client('0123456789ABCDEF', 'https://github.com/cedx/akismet', {foo: 'bar'})))
    );
  });

  /**
   * @test {Client#verifyKey}
   */
  describe('verifyKey()', () => {
    it('should return `false` for valid comment (e.g. ham)' , done =>
      _client.checkComment(_ham).subscribe(res => assert.equal(res, false), null, done)
    );

    it('should return `true` for invalid comment (e.g. spam)' , done =>
      _client.checkComment(_spam).subscribe(res => assert.equal(res, true), null, done)
    );
  });

  /**
   * @test {Client#submitHam}
   */
  describe('submitHam()', () => {
    it('should complete without error' , done =>
      _client.submitHam(_ham).subscribe({complete: done})
    );
  });

  /**
   * @test {Client#submitSpam}
   */
  describe('submitSpam()', () => {
    it('should complete without error' , done =>
      _client.submitSpam(_spam).subscribe({complete: done})
    );
  });

  /**
   * @test {Client#verifyKey}
   */
  describe('verifyKey()', () => {
    it('should return `true` for a valid API key' , done =>
      _client.verifyKey().subscribe(res => assert.equal(res, true), null, done)
    );

    it('should return `false` for an invalid API key' , done => {
      let client = new Client('viagra-test-123', _client.blog, {
        isTest: _client.isTest,
        serviceURL: _client.serviceURL
      });

      return client.verifyKey().subscribe(res => assert.equal(res, false), null, done);
    });
  });
});
