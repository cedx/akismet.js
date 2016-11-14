import assert from 'assert';
import {Author} from '../src/index';

/**
 * @test {Author}
 */
describe('Author', () => {

  /**
   * @test {Author#constructor}
   */
  describe('#constructor()', () => {
    it('should initialize the existing properties', () => {
      let author = new Author({email: 'cedric@belin.io', ipAddress: '192.168.0.1', name: 'Cédric Belin'});
      assert.equal(author.email, 'cedric@belin.io');
      assert.equal(author.ipAddress, '192.168.0.1');
      assert.equal(author.name, 'Cédric Belin');
    });

    it('should not create new properties', () => {
      assert.ok(!('foo' in new Author({foo: 'bar'})));
    });
  });

  /**
   * @test {Author.fromJSON}
   */
  describe('.fromJSON()', () => {
    it('should return a null reference with a non-object JSON string', () => {
      assert.strictEqual(Author.fromJSON('foo'), null);
    });

    it('should return an empty instance with an empty JSON object', () => {
      let author = Author.fromJSON({});
      assert.equal(author.email.length, 0);
      assert.equal(author.url.length, 0);
    });

    it('should return an initialized instance with a non-empty JSON object', () => {
      let author = Author.fromJSON({
        comment_author_email: 'cedric@belin.io',
        comment_author_url: 'https://belin.io'
      });

      assert.equal(author.email, 'cedric@belin.io');
      assert.equal(author.url, 'https://belin.io');
    });
  });

  /**
   * @test {Author#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return an empty JSON object with a newly created instance', () => {
      assert.equal(Object.keys(new Author().toJSON()).length, 0);
    });

    it('should return a non-empty JSON object with a initialized instance', () => {
      let data = new Author({
        email: 'cedric@belin.io',
        ipAddress: '127.0.0.1',
        name: 'Cédric Belin',
        url: 'https://belin.io'
      }).toJSON();

      assert.equal(data.comment_author, 'Cédric Belin');
      assert.equal(data.comment_author_email, 'cedric@belin.io');
      assert.equal(data.comment_author_url, 'https://belin.io');
      assert.equal(data.user_ip, '127.0.0.1');
    });
  });
});
