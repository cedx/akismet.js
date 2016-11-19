import {Author} from './author';

/**
 * Represents a comment submitted by an author.
 */
export class Comment {

  /**
   * Initializes a new instance of the class.
   * @param {object} [options] An object specifying values used to initialize this instance.
   */
  constructor(options = {}) {

    /**
     * The comment's author.
     * @type {Author}
     */
    this.author = null;
    if (options.author instanceof Author) this.author = options.author;
    else if (typeof options.author == 'string') this.author = new Author({name: options.author});

    /**
     * The comment's content.
     * @type {string}
     */
    this.content = typeof options.content == 'string' ? options.content : '';

    /**
     * The UTC timestamp of the creation of the comment.
     * @type {Date}
     */
    this.date = null;
    if (options.date instanceof Date) this.date = options.date;
    else {
      let type = typeof options.date;
      if (type == 'number' || type == 'string') this.date = new Date(options.date);
    }

    /**
     * The permanent location of the entry the comment is submitted to.
     * @type {string}
     */
    this.permalink = typeof options.permalink == 'string' ? options.permalink : '';

    /**
     * The UTC timestamp of the publication time for the post, page or thread on which the comment was posted.
     * @type {Date}
     */
    this.postModified = null;
    if (options.postModified instanceof Date) this.postModified = options.postModified;
    else {
      let type = typeof options.postModified;
      if (type == 'number' || type == 'string') this.postModified = new Date(options.postModified);
    }

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
   * @return {Comment} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJSON(map) {
    if (!map || typeof map != 'object') return null;

    let hasAuthor = Object.keys(map)
      .filter(key => /^comment_author/.test(key) || /^user/.test(key))
      .length > 0;

    return new Comment({
      author: hasAuthor ? Author.fromJSON(map) : null,
      content: map.comment_content,
      date: map.comment_date_gmt,
      permalink: map.permalink,
      postModified: map.comment_post_modified_gmt,
      referrer: map.referrer,
      type: map.comment_type
    });
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
    let json = JSON.stringify(this.toJSON(), null, 2);
    return `${this.constructor.name} ${json}`;
  }
}
