import {Author} from './author';

/**
 * Defines the options of a {@link Comment} instance.
 * @typedef {object} CommentOptions
 * @property {string} [content] The comment's content.
 * @property {?Date} [date] The UTC timestamp of the creation of the comment.
 * @property {?URL} [permalink] The permanent location of the entry the comment is submitted to.
 * @property {?Date} [postModified] The UTC timestamp of the publication time for the post, page or thread on which the comment was posted.
 * @property {?URL} [referrer] The URL of the webpage that linked to the entry being requested.
 * @property {string} [type] The comment's type.
 */

/** Represents a comment submitted by an author. */
export class Comment {

  /**
   * Creates a new comment.
   * @param {?Author} author The comment's author.
   * @param {CommentOptions} [options] An object specifying values used to initialize this instance.
   */
  constructor(author, options = {}) {
    const {content = '', date = null, permalink = null, postModified = null, referrer = null, type = ''} = options;

    /**
     * The comment's author.
     * @type {?Author}
     */
    this.author = author;

    /**
     * The comment's content.
     * @type {string}
     */
    this.content = content;

    /**
     * The UTC timestamp of the creation of the comment.
     * @type {?Date}
     */
    this.date = date;

    /**
     * The permanent location of the entry the comment is submitted to.
     * @type {?URL}
     */
    this.permalink = permalink;

    /**
     * The UTC timestamp of the publication time for the post, page or thread on which the comment was posted.
     * @type {?Date}
     */
    this.postModified = postModified;

    /**
     * The URL of the webpage that linked to the entry being requested.
     * @type {?URL}
     */
    this.referrer = referrer;

    /**
     * The comment's type.
     * @type {string}
     */
    this.type = type;
  }

  /**
   * Creates a new comment from the specified JSON object.
   * @param {Object<string, *>} map A JSON object representing a comment.
   * @return {Comment} The instance corresponding to the specified JSON map.
   */
  static fromJson(map) {
    const hasAuthor = Object.keys(map)
      .filter(key => /^comment_author/.test(key) || /^user/.test(key))
      .length > 0;

    return new Comment(hasAuthor ? Author.fromJson(map) : null, {
      content: typeof map.comment_content == 'string' ? map.comment_content : '',
      date: typeof map.comment_date_gmt == 'string' ? new Date(map.comment_date_gmt) : null,
      permalink: typeof map.permalink == 'string' ? new URL(map.permalink) : null,
      postModified: typeof map.comment_post_modified_gmt == 'string' ? new Date(map.comment_post_modified_gmt) : null,
      referrer: typeof map.referrer == 'string' ? new URL(map.referrer) : null,
      type: typeof map.comment_type == 'string' ? map.comment_type : ''
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {Object<string, *>} The map in JSON format corresponding to this object.
   */
  toJSON() {
    const map = this.author ? this.author.toJSON() : {};
    if (this.content.length) map.comment_content = this.content;
    if (this.date) map.comment_date_gmt = this.date.toISOString();
    if (this.postModified) map.comment_post_modified_gmt = this.postModified.toISOString();
    if (this.type.length) map.comment_type = this.type;
    if (this.permalink) map.permalink = this.permalink.href;
    if (this.referrer) map.referrer = this.referrer.href;
    return map;
  }
}

/**
 * Specifies the type of a comment.
 * @enum {string}
 */
export const CommentType = Object.freeze({

  /** A blog post. */
  blogPost: 'blog-post',

  /** A blog comment. */
  comment: 'comment',

  /** A contact form or feedback form submission. */
  contactForm: 'contact-form',

  /** A top-level forum post. */
  forumPost: 'forum-post',

  /** A message sent between just a few users. */
  message: 'message',

  /** A [pingback](https://en.wikipedia.org/wiki/Pingback) post. */
  pingback: 'pingback',

  /** A reply to a top-level forum post. */
  reply: 'reply',

  /** A new user account. */
  signup: 'signup',

  /** A [trackback](https://en.wikipedia.org/wiki/Trackback) post. */
  trackback: 'trackback',

  /** A [Twitter](https://twitter.com) message. */
  tweet: 'tweet'
});
