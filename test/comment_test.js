/**
 * Unit tests of the `comment` module.
 * @module comment_test
 */

// Module dependencies.
var assert=require('assert');
var akismet=require('../index');

var Author=akismet.Author;
var Comment=akismet.Comment;
var CommentType=akismet.CommentType;

/**
 * Tests the features of the `Author` class.
 * @class AuthorTest
 * @static
 */
var AuthorTest={

  /**
   * Runs the unit tests.
   * @method run
   */
  run: function() {
    var self=this;
    describe('Author', function() {
      describe('.fromJSON()', self.testFromJSON.bind(self));
      describe('#toJSON()', self.testToJSON.bind(self));
    });
  },

  /**
   * Tests the `Author.fromJSON()` method.
   * @method testFromJSON
   */
  testFromJSON: function() {
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
  },

  /**
   * Tests the `Author#toJSON()` method.
   * @method testToJSON
   */
  testToJSON: function() {
    it('should return an empty JSON object with a newly created instance', function() {
      assert.equal(new Author().toJSON(), '{}');
    });

    it('should return a non-empty JSON object with a initialized instance', function() {
      var author=new Author({ name: 'Cédric Belin', email: 'cedric@belin.io', ipAddress: '127.0.0.1', url: 'http://belin.io' });
      assert.equal(author.toJSON(), '{"comment_author":"Cédric Belin","comment_author_email":"cedric@belin.io","comment_author_url":"http://belin.io","user_ip":"127.0.0.1"}');
    });
  }
};

/**
 * Tests the features of the `Comment` class.
 * @class CommentTest
 * @static
 */
var CommentTest={

  /**
   * Runs the unit tests.
   * @method run
   */
  run: function() {
    var self=this;
    describe('Comment', function() {
      describe('.fromJSON()', self.testFromJSON);
      describe('#toJSON()', self.testToJSON);
    });
  },

  /**
   * Tests the `Comment.fromJSON()` method.
   * @method testFromJSON
   */
  testFromJSON: function() {
    it('should return a null reference with a non-object JSON string', function() {
      assert.strictEqual(Comment.fromJSON('foo'), null);
    });

    it('should return an empty instance with an empty JSON object', function() {
      var comment=Comment.fromJSON({});
      assert.strictEqual(comment.author, null);
      assert.strictEqual(comment.content, null);
      assert.strictEqual(comment.referrer, null);
      assert.strictEqual(comment.type, null);
    });

    it('should return an initialized instance with a non-empty JSON object', function() {
      var comment=Comment.fromJSON({ comment_author: 'Cédric Belin', comment_content: 'A user comment.', comment_type: 'trackback', referrer: 'http://belin.io' });
      assert(comment.author instanceof Author);
      assert.equal(comment.author.name, 'Cédric Belin');
      assert.equal(comment.content, 'A user comment.');
      assert.equal(comment.referrer, 'http://belin.io');
      assert.equal(comment.type, CommentType.TRACKBACK);
    });
  },

  /**
   * Tests the `Comment#toJSON()` method.
   * @method testToJSON
   */
  testToJSON: function() {
    it('should return an empty JSON object with a newly created instance', function() {
      assert.equal(new Comment().toJSON(), '{}');
    });

    it('should return a non-empty JSON object with a initialized instance', function() {
      var comment=new Comment({ author: new Author({ name: 'Cédric Belin' }), content: 'A user comment.', referrer: 'http://belin.io', type: CommentType.PINGBACK });
      assert.equal(comment.toJSON(), '{"comment_author":"Cédric Belin","comment_content":"A user comment.","comment_type":"pingback","referrer":"http://belin.io"}');
    });
  }
};

// Run all tests.
AuthorTest.run();
CommentTest.run();
