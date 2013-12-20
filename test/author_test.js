/**
 * Unit tests of the `author` module.
 * @module author_test
 */

// Module dependencies.
var assert=require('assert');
var Author=require('../index').Author;

// Tests the features of `Author` class.
describe('Author', function() {

  // Tests the `Author.fromJSON` method.
  describe('.fromJSON()', function() {
    it('should return a null reference with a non-object JSON string', function() {
      assert.strictEqual(Author.fromJSON('foo'), null);
    });

    it('should return an empty instance with an empty JSON object', function() {
      var author=Author.fromJSON({});
      assert.strictEqual(author.email, null);
      assert.strictEqual(author.url, null);
    });

    it('should return an initialized instance with a non-empty JSON object', function() {
      var author=Author.fromJSON({ comment_author_email: 'cedric@belin.io', comment_author_url: 'http://belin.io' });
      assert.equal(author.email, 'cedric@belin.io');
      assert.equal(author.url, 'http://belin.io');
    });
  });

  // Tests the `Author#toJSON` method.
  describe('#toJSON()', function() {
    it('should return an empty JSON object with a newly created instance', function() {
      assert.equal(new Author().toJSON(), '{}');
    });

    it('should return a non-empty JSON object with a initialized instance', function() {
      var author=new Author({ name: 'Cédric Belin', email: 'cedric@belin.io', ipAddress: '127.0.0.1', url: 'http://belin.io' });
      assert.equal(author.toJSON(), '{"comment_author":"Cédric Belin","comment_author_email":"cedric@belin.io","comment_author_url":"http://belin.io","user_ip":"127.0.0.1"}');
    });
  });
});
