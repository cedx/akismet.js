import {Enum} from '@cedx/enum';
import {Author} from './author';

/**
 * Represents a comment submitted by an author.
 */
export class Comment {

  /**
   * Initializes a new instance of the class.
   * @param {Author} [author] The comment's author.
   * @param {string} [content] The comment's content.
   * @param {string} [type] The comment's type.
   */
  constructor(author = null, content = '', type = '') {

    /**
     * The comment's author.
     * @type {Author}
     */
    this.author = author;

    /**
     * The comment's content.
     * @type {string}
     */
    this.content = content;

    /**
     * The UTC timestamp of the creation of the comment.
     * @type {Date}
     */
    this.date = null;

    /**
     * The permanent location of the entry the comment is submitted to.
     * @type {string}
     */
    this.permalink = '';

    /**
     * The UTC timestamp of the publication time for the post, page or thread on which the comment was posted.
     * @type {Date}
     */
    this.postModified = null;

    /**
     * The URL of the webpage that linked to the entry being requested.
     * @type {string}
     */
    this.referrer = '';

    /**
     * The comment's type.
     * This string value specifies a `CommentType` constant or a made up value like `"registration"`.
     * @type {string}
     */
    this.type = type;
  }

  /**
   * Creates a new comment from the specified JSON map.
   * @param {object} map A JSON map representing a comment.
   * @return {Comment} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJSON(map) {
    if (!map || typeof map != 'object') return null;

    let hasAuthor = Object.keys(map)
      .filter(key => /^comment_author/.test(key) || /^user/.test(key))
      .length > 0;

    let comment = new Comment(hasAuthor ? Author.fromJSON(map) : null);
    comment.content = typeof map.comment_content == 'string' ? map.comment_content : '';
    comment.date = typeof map.comment_date_gmt == 'string' ? new Date(map.comment_date_gmt) : null;
    comment.permalink = typeof map.permalink == 'string' ? map.permalink : '';
    comment.postModified = typeof map.comment_post_modified_gmt == 'string' ? new Date(map.comment_post_modified_gmt) : null;
    comment.referrer = typeof map.referrer == 'string' ? map.referrer : '';
    comment.type = typeof map.comment_type == 'string' ? map.comment_type : '';
    return comment;
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    let map = this.author ? this.author.toJSON() : {};
    if (this.content.length) map.comment_content = this.content;
    if (this.date) map.comment_date_gmt = this.date.toISOString();
    if (this.postModified) map.comment_post_modified_gmt = this.postModified.toISOString();
    if (this.type.length) map.comment_type = this.type;
    if (this.permalink.length) map.permalink = this.permalink;
    if (this.referrer.length) map.referrer = this.referrer;
    return map;
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return `${this.constructor.name} ${JSON.stringify(this)}`;
  }
}

/**
 * Specifies the type of a comment.
 * @type {object}
 *
 * @property {string} COMMENT A standard comment.
 * @property {string} PINGBACK A [pingback](https://en.wikipedia.org/wiki/Pingback) comment.
 * @property {string} TRACKBACK A [trackback](https://en.wikipedia.org/wiki/Trackback) comment.
 */
export const CommentType = Object.freeze({
  COMMENT: 'comment',
  PINGBACK: 'pingback',
  TRACKBACK: 'trackback'
});
