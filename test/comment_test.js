'use strict';

import {expect} from 'chai';
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
      expect(Comment.fromJSON('foo')).to.be.null;
    });

    it('should return an empty instance with an empty map', () => {
      let comment = Comment.fromJSON({});
      expect(comment.author).to.be.null;
      expect(comment.content).to.be.empty;
      expect(comment.date).to.be.null;
      expect(comment.referrer).to.be.empty;
      expect(comment.type).to.be.empty;
    });

    it('should return an initialized instance with a non-empty map', () => {
      let comment = Comment.fromJSON({
        comment_author: 'Cédric Belin',
        comment_content: 'A user comment.',
        comment_date_gmt: '2000-01-01T00:00:00.000Z',
        comment_type: 'trackback',
        referrer: 'https://belin.io'
      });

      expect(comment.author).to.be.instanceof(Author);
      expect(comment.author.name).to.equal('Cédric Belin');
      expect(comment.content).to.equal('A user comment.');
      expect(comment.date).to.be.instanceof(Date);
      expect(comment.referrer).to.equal('https://belin.io');
      expect(comment.type).to.equal(CommentType.TRACKBACK);
    });
  });

  /**
   * @test {Comment#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return an empty map with a newly created instance', () => {
      expect(new Comment().toJSON()).to.be.empty;
    });

    it('should return a non-empty map with a initialized instance', () => {
      let author = new Author();
      author.name = 'Cédric Belin';

      let comment = new Comment(author, 'A user comment.', CommentType.PINGBACK);
      comment.date = new Date('2000-01-01T00:00:00.000Z');
      comment.referrer = 'https://belin.io';

      let data = comment.toJSON();
      expect(data.comment_author).to.equal('Cédric Belin');
      expect(data.comment_content).to.equal('A user comment.');
      expect(data.comment_date_gmt).to.equal('2000-01-01T00:00:00.000Z');
      expect(data.comment_type).to.equal('pingback');
      expect(data.referrer).to.equal('https://belin.io');
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
      expect(data.indexOf('Comment {')).to.equal(0);
    });

    it('should contain the instance properties', () => {
      expect(data).to.contain('"comment_author":"Cédric Belin"')
        .and.contain('"comment_content":"A user comment."')
        .and.contain('"comment_type":"pingback"')
        .and.contain('"comment_date_gmt":"2000-01-01T00:00:00.000Z"')
        .and.contain('"referrer":"https://belin.io"');
    });
  });
});
