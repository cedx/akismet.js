import assert from 'assert';
import {Author, Comment, CommentType} from '../src/index';

/**
 * @test {Comment}
 */
describe('Comment', () => {

  /**
   * @test {Comment#constructor}
   */
  describe('#constructor()', () => {
    it('should initialize the existing properties', () => {
      let comment = new Comment({content: 'Hello World!', date: new Date(), referrer: 'https://github.com/cedx/akismet.js'});
      assert.equal(comment.content, 'Hello World!');
      assert(comment.date instanceof Date);
      assert.equal(comment.referrer, 'https://github.com/cedx/akismet.js');
    });

    it('should not create new properties', () =>
      assert(!('foo' in new Comment({content: 'Hello World!', foo: 'bar'})))
    );
  });

  /**
   * @test {Comment.fromJSON}
   */
  describe('.fromJSON()', () => {
    it('should return a null reference with a non-object JSON string', () =>
      assert.strictEqual(Comment.fromJSON('foo'), null)
    );

    it('should return an empty instance with an empty JSON object', () => {
      let comment = Comment.fromJSON({});
      assert.strictEqual(comment.author, null);
      assert(!comment.content.length);
      assert.strictEqual(comment.date, null);
      assert(!comment.referrer.length);
      assert(!comment.type.length);
    });

    it('should return an initialized instance with a non-empty JSON object', () => {
      let comment = Comment.fromJSON({
        comment_author: 'Cédric Belin',
        comment_content: 'A user comment.',
        comment_date_gmt: '2000-01-01T00:00:00.000Z',
        comment_type: 'trackback',
        referrer: 'https://belin.io'
      });

      assert(comment.author instanceof Author);
      assert.equal(comment.author.name, 'Cédric Belin');
      assert.equal(comment.content, 'A user comment.');
      assert(comment.date instanceof Date);
      assert.equal(comment.referrer, 'https://belin.io');
      assert.equal(comment.type, CommentType.TRACKBACK);
    });
  });

  /**
   * @test {Comment#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return an empty JSON object with a newly created instance', () =>
      assert(!Object.keys(new Comment().toJSON()).length)
    );

    it('should return a non-empty JSON object with a initialized instance', () => {
      let data = new Comment({
        author: new Author({name: 'Cédric Belin'}),
        content: 'A user comment.',
        referrer: 'https://belin.io',
        type: CommentType.PINGBACK
      }).toJSON();

      assert.equal(data.comment_author, 'Cédric Belin');
      assert.equal(data.comment_content, 'A user comment.');
      assert.equal(data.comment_type, 'pingback');
      assert.equal(data.referrer, 'https://belin.io');
    });
  });
});
