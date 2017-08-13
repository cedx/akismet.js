'use strict';

const {URL} = require('url');
const {Author} = require('./author');

/**
 * Represents a comment submitted by an author.
 */
exports.Comment = class Comment {

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
     * @type {URL}
     */
    this.permalink = null;

    /**
     * The UTC timestamp of the publication time for the post, page or thread on which the comment was posted.
     * @type {Date}
     */
    this.postModified = null;

    /**
     * The URL of the webpage that linked to the entry being requested.
     * @type {URL}
     */
    this.referrer = null;

    /**
     * The comment's type.
     * This string value specifies a `CommentType` constant or a made up value like `"registration"`.
     * @type {string}
     */
    this.type = type;
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'Comment';
  }

  /**
   * Creates a new comment from the specified JSON map.
   * @param {object} map A JSON map representing a comment.
   * @return {Comment} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJson(map) {
    if (!map || typeof map != 'object') return null;

    let hasAuthor = Object.keys(map)
      .filter(key => /^comment_author/.test(key) || /^user/.test(key))
      .length > 0;

    let comment = new Comment(hasAuthor ? Author.fromJson(map) : null);
    comment.content = typeof map.comment_content == 'string' ? map.comment_content : '';
    comment.date = typeof map.comment_date_gmt == 'string' ? new Date(map.comment_date_gmt) : null;
    comment.permalink = typeof map.permalink == 'string' ? new URL(map.permalink) : null;
    comment.postModified = typeof map.comment_post_modified_gmt == 'string' ? new Date(map.comment_post_modified_gmt) : null;
    comment.referrer = typeof map.referrer == 'string' ? new URL(map.referrer) : null;
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
    if (this.permalink) map.permalink = this.permalink.href;
    if (this.referrer) map.referrer = this.referrer.href;
    return map;
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }
};
