'use strict';

import assert from 'assert';
import {Author, Comment, CommentType} from '../src/index';

/**
 * @test {Comment}
 */
describe('Comment', () => {

  /**
   * @test {Comment.fromJSON}
   */
  describe('.fromJSON()', () => {
    it('should return a null reference with a non-object value', () => {
      assert.strictEqual(Comment.fromJSON('foo'), null);
    });

    it('should return an empty instance with an empty map', () => {
      let comment = Comment.fromJSON({});
      assert.strictEqual(comment.author, null);
      assert.equal(comment.content.length, 0);
      assert.strictEqual(comment.date, null);
      assert.equal(comment.referrer.length, 0);
      assert.equal(comment.type.length, 0);
    });

    it('should return an initialized instance with a non-empty map', () => {
      let comment = Comment.fromJSON({
        comment_author: 'Cédric Belin',
        comment_content: 'A user comment.',
        comment_date_gmt: '2000-01-01T00:00:00.000Z',
        comment_type: 'trackback',
        referrer: 'https://belin.io'
      });

      assert.ok(comment.author instanceof Author);
      assert.equal(comment.author.name, 'Cédric Belin');
      assert.equal(comment.content, 'A user comment.');
      assert.ok(comment.date instanceof Date);
      assert.equal(comment.referrer, 'https://belin.io');
      assert.equal(comment.type, CommentType.TRACKBACK);
    });
  });

  /**
   * @test {Comment#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return an empty map with a newly created instance', () => {
      assert.equal(Object.keys(new Comment().toJSON()).length, 0);
    });

    it('should return a non-empty map with a initialized instance', () => {
      let author = new Author();
      author.name = 'Cédric Belin';

      let comment = new Comment(author, 'A user comment.', CommentType.PINGBACK);
      comment.date = new Date('2000-01-01T00:00:00.000Z');
      comment.referrer = 'https://belin.io';

      let data = comment.toJSON();
      assert.equal(data.comment_author, 'Cédric Belin');
      assert.equal(data.comment_content, 'A user comment.');
      assert.equal(data.comment_date_gmt, '2000-01-01T00:00:00.000Z');
      assert.equal(data.comment_type, 'pingback');
      assert.equal(data.referrer, 'https://belin.io');
    });
  });

  /**
   * @test {Comment#toString}
   */
  describe('#toString()', () => {
    let author = new Author();
    author.name = 'Cédric Belin';

    let comment = new Comment(author, 'A user comment.', CommentType.PINGBACK);
    comment.date = new Date('2000-01-01T00:00:00.000Z');
    comment.referrer = 'https://belin.io';

    let data = String(comment);
    it('should start with the class name', () => {
      assert.equal(data.indexOf('Comment {'), 0);
    });

    it('should contain the instance properties', () => {
      assert.ok(data.includes('"comment_author":"Cédric Belin"'));
      assert.ok(data.includes('"comment_content":"A user comment."'));
      assert.ok(data.includes('"comment_type":"pingback"'));
      assert.ok(data.includes('"comment_date_gmt":"2000-01-01T00:00:00.000Z"'));
      assert.ok(data.includes('"referrer":"https://belin.io"'));
    });
  });
});
