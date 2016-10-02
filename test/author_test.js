/**
 * Implementation of the `akismet.tests.AuthorTest` class.
 * @module test/author_test
 */
const assert = require('assert');
const {Author} = require('../lib');

/**
 * Tests the features of the `Author` class.
 */
class AuthorTest {

  /**
   * Runs the unit tests.
   */
  run() {
    describe('Author', () => {
      describe('fromJSON()', this.testFromJSON);
      describe('toJSON()', this.testToJSON);
    });
  }

  /**
   * Tests the `fromJSON` method.
   */
  testFromJSON() {
    it('should return a null reference with a non-object JSON string', () =>
      assert.strictEqual(Author.fromJSON('foo'), null)
    );

    it('should return an empty instance with an empty JSON object', () => {
      let author = Author.fromJSON({});
      assert(!author.email.length);
      assert(!author.url.length);
    });

    it('should return an initialized instance with a non-empty JSON object', () => {
      let author = Author.fromJSON({
        comment_author_email: 'cedric@belin.io',
        comment_author_url: 'https://www.belin.io'
      });

      assert.equal(author.email, 'cedric@belin.io');
      assert.equal(author.url, 'https://www.belin.io');
    });
  }

  /**
   * Tests the `toJSON` method.
   */
  testToJSON() {
    it('should return an empty JSON object with a newly created instance', () =>
      assert(!Object.keys(new Author().toJSON()).length)
    );

    it('should return a non-empty JSON object with a initialized instance', () => {
      let data = new Author({
        name: 'Cédric Belin',
        email: 'cedric@belin.io',
        ipAddress: '127.0.0.1',
        url: 'https://www.belin.io'
      }).toJSON();

      assert.equal(data.comment_author, 'Cédric Belin');
      assert.equal(data.comment_author_email, 'cedric@belin.io');
      assert.equal(data.comment_author_url, 'https://www.belin.io');
      assert.equal(data.user_ip, '127.0.0.1');
    });
  }
}

// Run all tests.
new AuthorTest().run();
