/**
 * Unit tests of the `comment` module.
 * @module test.comment_test
 */
'use strict';

// Module dependencies.
const assert=require('assert');
const cmt=require('../lib/comment');

/**
 * Tests the features of the `akismet.Author` class.
 */
class AuthorTest {

  /**
   * Runs the unit tests.
   */
  run() {
    let self=this;
    describe('Author', function() {
      describe('fromJSON()', self.testFromJSON);
      describe('toJSON()', self.testToJSON);
    });
  }

  /**
   * Tests the `fromJSON` method.
   */
  testFromJSON() {
    it('should return a null reference with a non-object JSON string', () =>
      assert.strictEqual(cmt.Author.fromJSON('foo'), null)
    );

    it('should return an empty instance with an empty JSON object', () => {
      let author=cmt.Author.fromJSON('{}');
      assert.strictEqual(author.email, null);
      assert.strictEqual(author.url, null);
    });

    it('should return an initialized instance with a non-empty JSON object', () => {
      let author=cmt.Author.fromJSON('{ "comment_author_email": "cedric@belin.io", "comment_author_url": "http://www.belin.io" }');
      assert.equal(author.email, 'cedric@belin.io');
      assert.equal(author.url, 'http://www.belin.io');
    });
  }

  /**
   * Tests the `toJSON` method.
   */
  testToJSON() {
    it('should return an empty JSON object with a newly created instance', () =>
      assert.equal(new cmt.Author().toJSON(), '{}')
    );

    it('should return a non-empty JSON object with a initialized instance', () => {
      let author=new cmt.Author({
        name: 'Cédric Belin',
        email: 'cedric@belin.io',
        ipAddress: '127.0.0.1',
        url: 'http://www.belin.io'
      });

      assert.equal(author.toJSON(), '{"comment_author":"Cédric Belin","comment_author_email":"cedric@belin.io","comment_author_url":"http://www.belin.io","user_ip":"127.0.0.1"}');
    });
  }
}

/**
 * Tests the features of the `akismet.Comment` class.
 */
class CommentTest {

  /**
   * Runs the unit tests.
   */
  run() {
    let self=this;
    describe('Comment', function() {
      describe('fromJSON()', self.testFromJSON);
      describe('toJSON()', self.testToJSON);
    });
  }

  /**
   * Tests the `fromJSON` method.
   */
  testFromJSON() {
    it('should return a null reference with a non-object JSON string', () =>
      assert.strictEqual(cmt.Comment.fromJSON('foo'), null)
    );

    it('should return an empty instance with an empty JSON object', () => {
      let comment=cmt.Comment.fromJSON('{}');
      assert.strictEqual(comment.author, null);
      assert.strictEqual(comment.content, null);
      assert.strictEqual(comment.date, null);
      assert.strictEqual(comment.referrer, null);
      assert.strictEqual(comment.type, null);
    });

    it('should return an initialized instance with a non-empty JSON object', () => {
      let comment=cmt.Comment.fromJSON('{ "comment_author": "Cédric Belin", "comment_content": "A user comment.", "comment_date_gmt": "2000-01-01T00:00:00.000Z", "comment_type": "trackback", "referrer": "http://www.belin.io" }');
      assert(comment.author instanceof cmt.Author);
      assert(comment.date instanceof Date);
      assert.equal(comment.author.name, 'Cédric Belin');
      assert.equal(comment.content, 'A user comment.');
      assert.equal(comment.referrer, 'http://www.belin.io');
      assert.equal(comment.type, cmt.CommentType.TRACKBACK);
    });
  }

  /**
   * Tests the `toJSON` method.
   */
  testToJSON() {
    it('should return an empty JSON object with a newly created instance', () =>
      assert.equal(new cmt.Comment().toJSON(), '{}')
    );

    it('should return a non-empty JSON object with a initialized instance', () => {
      let comment=new cmt.Comment({
        author: new cmt.Author({ name: 'Cédric Belin' }),
        content: 'A user comment.',
        referrer: 'http://www.belin.io',
        type: cmt.CommentType.PINGBACK
      });

      assert.equal(comment.toJSON(), '{"comment_author":"Cédric Belin","comment_content":"A user comment.","comment_type":"pingback","referrer":"http://www.belin.io"}');
    });
  }
}

// Run all tests.
new AuthorTest().run();
new CommentTest().run();
