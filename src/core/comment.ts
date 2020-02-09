import {Author} from './author';
import {JsonObject} from './json';

/** Represents a comment submitted by an author. */
export class Comment {

  /** The comment's content. */
  content: string;

  /** The UTC timestamp of the creation of the comment. */
  date?: Date;

  /** The permanent location of the entry the comment is submitted to. */
  permalink?: URL;

  /** The UTC timestamp of the publication time for the post, page or thread on which the comment was posted. */
  postModified?: Date;

  /** A string describing why the content is being rechecked. */
  recheckReason: string;

  /** The URL of the webpage that linked to the entry being requested. */
  referrer?: URL;

  /** The comment's type. */
  type: string;

  /**
   * Creates a new comment.
   * @param author The comment's author.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(public author?: Author, options: Partial<CommentOptions> = {}) {
    const {content = '', date, permalink, postModified, recheckReason = '', referrer, type = ''} = options;
    this.content = content;
    this.date = date;
    this.permalink = permalink;
    this.postModified = postModified;
    this.recheckReason = recheckReason;
    this.referrer = referrer;
    this.type = type;
  }

  /**
   * Creates a new comment from the specified JSON object.
   * @param map A JSON object representing a comment.
   * @return The instance corresponding to the specified JSON object.
   */
  static fromJson(map: JsonObject): Comment {
    const hasAuthor = Object.keys(map)
      .filter(key => /^comment_author/.test(key) || /^user/.test(key))
      .length > 0;

    return new Comment(hasAuthor ? Author.fromJson(map) : undefined, {
      content: typeof map.comment_content == 'string' ? map.comment_content : '',
      date: typeof map.comment_date_gmt == 'string' ? new Date(map.comment_date_gmt) : undefined,
      permalink: typeof map.permalink == 'string' ? new URL(map.permalink) : undefined,
      postModified: typeof map.comment_post_modified_gmt == 'string' ? new Date(map.comment_post_modified_gmt) : undefined,
      recheckReason: typeof map.recheck_reason == 'string' ? map.recheck_reason : '',
      referrer: typeof map.referrer == 'string' ? new URL(map.referrer) : undefined,
      type: typeof map.comment_type == 'string' ? map.comment_type : ''
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  toJSON(): JsonObject {
    const map = this.author ? this.author.toJSON() : {};
    if (this.content.length) map.comment_content = this.content;
    if (this.date) map.comment_date_gmt = this.date.toISOString();
    if (this.permalink) map.permalink = this.permalink.href;
    if (this.postModified) map.comment_post_modified_gmt = this.postModified.toISOString();
    if (this.recheckReason.length) map.recheck_reason = this.recheckReason;
    if (this.referrer) map.referrer = this.referrer.href;
    if (this.type.length) map.comment_type = this.type;
    return map;
  }
}

/** Defines the options of a [[Comment]] instance. */
export interface CommentOptions {

  /** The comment's content. */
  content: string;

  /** The UTC timestamp of the creation of the comment. */
  date: Date;

  /** The permanent location of the entry the comment is submitted to. */
  permalink: URL;

  /** The UTC timestamp of the publication time for the post, page or thread on which the comment was posted. */
  postModified: Date;

  /** A string describing why the content is being rechecked. */
  recheckReason: string;

  /** The URL of the webpage that linked to the entry being requested. */
  referrer: URL;

  /** The comment's type. */
  type: string;
}

/** Specifies the type of a comment. */
export enum CommentType {

  /** A blog post. */
  blogPost = 'blog-post',

  /** A blog comment. */
  comment = 'comment',

  /** A contact form or feedback form submission. */
  contactForm = 'contact-form',

  /** A top-level forum post. */
  forumPost = 'forum-post',

  /** A [pingback](https://en.wikipedia.org/wiki/Pingback) post. */
  pingback = 'pingback',

  /** A [trackback](https://en.wikipedia.org/wiki/Trackback) post. */
  trackback = 'trackback',

  /** A [Twitter](https://twitter.com) message. */
  tweet = 'tweet'
}
