/**
 * Implementation of the `Comment` class.
 * @module core/comment
 */
const Author = require('./author');

/**
 * Represents a comment submitted by an author.
 */
module.exports = class Comment {

  /**
   * Initializes a new instance of the class.
   * @param {object} [options] An object specifying values used to initialize this instance.
   */
  constructor(options = {}) {

    /**
     * The comment's author.
     * @type {Author}
     */
    this.author = options.author instanceof Author ? options.author : null;

    /**
     * The comment's content.
     * @type {string}
     */
    this.content = typeof options.content == 'string' ? options.content : '';

    /**
     * The UTC timestamp of the creation of the comment.
     * @avar {Date}
     */
    this.date = options.date instanceof Date ? options.date : null;

    /**
     * The permanent location of the entry the comment is submitted to.
     * @type {string}
     */
    this.permalink = typeof options.permalink == 'string' ? options.permalink : '';

    /**
     * The UTC timestamp of the publication time for the post, page or thread on which the comment was posted.
     * @avar {Date}
     */
    this.postModified = options.postModified instanceof Date ? options.postModified : null;

    /**
     * The URL of the webpage that linked to the entry being requested.
     * @type {string}
     */
    this.referrer = typeof options.referrer == 'string' ? options.referrer : '';

    /**
     * The comment's type.
     * This string value specifies a `CommentType` constant or a made up value like `"registration"`.
     * @type {string}
     */
    this.type = typeof options.type == 'string' ? options.type : '';
  }

  /**
   * Creates a new comment from the specified JSON map.
   * @param {object} map A JSON map representing a comment.
   * @returns {Comment} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJSON(map) {
    if (!map || typeof map != 'object') return null;

    let hasAuthor = Object.keys(map)
      .filter(key => /^comment_author/.test(key) || /^user/.test(key))
      .length > 0;

    return new Comment({
      author: hasAuthor ? Author.fromJSON(map) : null,
      content: typeof map.comment_content == 'string' ? map.comment_content : '',
      date: typeof map.comment_date_gmt == 'string' ? new Date(map.comment_date_gmt) : null,
      permalink: typeof map.permalink == 'string' ? map.permalink : '',
      postModified: typeof map.comment_post_modified_gmt == 'string' ? new Date(map.comment_post_modified_gmt) : null,
      referrer: typeof map.referrer == 'string' ? map.referrer : '',
      type: typeof map.comment_type == 'string' ? map.comment_type : ''
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @returns {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    let map = {};

    if (this.author instanceof Author) Object.assign(map, this.author.toJSON());
    if (this.content.length) map.comment_content = this.content;
    if (this.date instanceof Date) map.comment_date_gmt = this.date.toISOString();
    if (this.postModified instanceof Date) map.comment_post_modified_gmt = this.postModified.toISOString();
    if (this.type.length) map.comment_type = this.type;
    if (this.permalink.length) map.permalink = this.permalink;
    if (this.referrer.length) map.referrer = this.referrer;

    return map;
  }

  /**
   * Returns a string representation of this object.
   * @returns {string} The string representation of this object.
   */
  toString() {
    let json = JSON.stringify(this.toJSON(), null, 2);
    return `${this.constructor.name} ${json}`;
  }
};
