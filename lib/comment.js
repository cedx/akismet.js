'use strict';

const {URL} = require('url');
const {Author} = require('./author');

/**
 * Represents a comment submitted by an author.
 */
exports.Comment = class Comment {

  /**
   * Initializes a new instance of the class.
   * @param {Author} author The comment's author.
   * @param {object} [options] An object specifying values used to initialize this instance.
   */
  constructor(author, {content = '', date = null, permalink = null, postModified = null, referrer = null, type = ''} = {}) {

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
    this.date = date instanceof Date ? date : null;
    if (!this.date && (Number.isInteger(date) || typeof date == 'string')) this.date = new Date(date);

    /**
     * The permanent location of the entry the comment is submitted to.
     * @type {URL}
     */
    this.permalink = typeof permalink == 'string' ? new URL(permalink) : permalink;

    /**
     * The UTC timestamp of the publication time for the post, page or thread on which the comment was posted.
     * @type {Date}
     */
    this.postModified = postModified instanceof Date ? postModified : null;
    if (!this.postModified && (Number.isInteger(postModified) || typeof postModified == 'string')) this.postModified = new Date(postModified);

    /**
     * The URL of the webpage that linked to the entry being requested.
     * @type {URL}
     */
    this.referrer = typeof referrer == 'string' ? new URL(referrer) : referrer;

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

    let options = {
      content: typeof map.comment_content == 'string' ? map.comment_content : '',
      date: typeof map.comment_date_gmt == 'string' ? map.comment_date_gmt : null,
      permalink: typeof map.permalink == 'string' ? map.permalink : null,
      postModified: typeof map.comment_post_modified_gmt == 'string' ? map.comment_post_modified_gmt : null,
      referrer: typeof map.referrer == 'string' ? map.referrer : null,
      type: typeof map.comment_type == 'string' ? map.comment_type : ''
    };

    return new Comment(hasAuthor ? Author.fromJson(map) : null, options);
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    let map = this.author.toJSON();
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

/**
 * Specifies the type of a comment.
 * @type {object}
 *
 * @property {string} blogPost A blog post.
 * @property {string} comment A blog comment.
 * @property {string} contactForm A contact form or feedback form submission.
 * @property {string} forumPost A top-level forum post.
 * @property {string} message A message sent between just a few users.
 * @property {string} pingback A [pingback](https://en.wikipedia.org/wiki/Pingback) post.
 * @property {string} reply A reply to a top-level forum post.
 * @property {string} signup A new user account.
 * @property {string} trackback A [trackback](https://en.wikipedia.org/wiki/Trackback) post.
 * @property {string} tweet A [Twitter](https://twitter.com) message.
 */
exports.CommentType = Object.freeze({
  blogPost: 'blog-post',
  comment: 'comment',
  contactForm: 'contact-form',
  forumPost: 'forum-post',
  message: 'message',
  pingback: 'pingback',
  reply: 'reply',
  signup: 'signup',
  trackback: 'trackback',
  tweet: 'tweet'
});
