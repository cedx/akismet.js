/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import {Author, Comment, CommentType} from '../src';

/**
 * Tests the `Comment}
 */
describe('Comment', () => {

  /**
   * Tests the `Comment.fromJson}
   */
  describe('.fromJson()', () => {
    it('should return a null reference with a non-object value', () => {
      expect(Comment.fromJson('foo')).to.be.null;
    });

    it('should return an empty instance with an empty map', () => {
      const comment = Comment.fromJson({});
      expect(comment.author).to.be.null;
      expect(comment.content).to.be.empty;
      expect(comment.date).to.be.null;
      expect(comment.referrer).to.be.null;
      expect(comment.type).to.be.empty;
    });

    it('should return an initialized instance with a non-empty map', () => {
      const comment = Comment.fromJson({
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
      expect(comment.date.getFullYear()).to.equal(2000);
      expect(comment.referrer).to.be.instanceof(URL).and.have.property('href').that.equal('https://belin.io/');
      expect(comment.type).to.equal(CommentType.trackback);
    });
  });

  /**
   * Tests the `Comment#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return only the author info with a newly created instance', () => {
      const data = new Comment(new Author('127.0.0.1', 'Doom/6.6.6')).toJSON();
      expect(Object.keys(data)).to.have.lengthOf(2);
      expect(data.user_agent).to.equal('Doom/6.6.6');
      expect(data.user_ip).to.equal('127.0.0.1');
    });

    it('should return a non-empty map with an initialized instance', () => {
      const data = new Comment(new Author('127.0.0.1', 'Doom/6.6.6', {name: 'Cédric Belin'}), {
        content: 'A user comment.',
        date: new Date('2000-01-01T00:00:00.000Z'),
        referrer: 'https://belin.io',
        type: CommentType.pingback
      }).toJSON();

      expect(Object.keys(data)).to.have.lengthOf(7);
      expect(data.comment_author).to.equal('Cédric Belin');
      expect(data.comment_content).to.equal('A user comment.');
      expect(data.comment_date_gmt).to.equal('2000-01-01T00:00:00.000Z');
      expect(data.comment_type).to.equal('pingback');
      expect(data.referrer).to.equal('https://belin.io/');
      expect(data.user_agent).to.equal('Doom/6.6.6');
      expect(data.user_ip).to.equal('127.0.0.1');
    });
  });

  /**
   * Tests the `Comment#toString}
   */
  describe('#toString()', () => {
    const data = String(new Comment(new Author('127.0.0.1', 'Doom/6.6.6', {name: 'Cédric Belin'}), {
      content: 'A user comment.',
      date: new Date('2000-01-01T00:00:00.000Z'),
      referrer: 'https://belin.io',
      type: CommentType.pingback
    }));

    it('should start with the class name', () => {
      expect(data.startsWith('Comment {')).to.be.true;
    });

    it('should contain the instance properties', () => {
      expect(data).to.contain('"comment_author":"Cédric Belin"')
        .and.contain('"comment_content":"A user comment."')
        .and.contain('"comment_type":"pingback"')
        .and.contain('"comment_date_gmt":"2000-01-01T00:00:00.000Z"')
        .and.contain('"referrer":"https://belin.io/"')
        .and.contain('"user_agent":"Doom/6.6.6"')
        .and.contain('"user_ip":"127.0.0.1"');
    });
  });
});
