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

// Tests the features of `Comment` class.
describe('Comment', function() {

  // Tests the `Comment.fromJSON` method.
  describe('.fromJSON()', function() {
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
  });

  // Tests the `Comment#toJSON` method.
  describe('#toJSON()', function() {
    it('should return an empty JSON object with a newly created instance', function() {
      assert.equal(new Comment().toJSON(), '{}');
    });

    it('should return a non-empty JSON object with a initialized instance', function() {
      var comment=new Comment({ author: new Author({ name: 'Cédric Belin' }), content: 'A user comment.', referrer: 'http://belin.io', type: CommentType.PINGBACK });
      assert.equal(comment.toJSON(), '{"comment_author":"Cédric Belin","comment_content":"A user comment.","comment_type":"pingback","referrer":"http://belin.io"}');
    });
  });
});
