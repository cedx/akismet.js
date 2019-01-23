import {Author} from './author';
import {JsonMap} from './map';

/**
 * Represents a comment submitted by an author.
 */
export class Comment {

  /**
   * The class name.
   */
  readonly [Symbol.toStringTag]: string = 'Comment';

  /**
   * The comment's content.
   */
  content: string;

  /**
   * The UTC timestamp of the creation of the comment.
   */
  date: Date | null;

  /**
   * The permanent location of the entry the comment is submitted to.
   */
  permalink: URL | null;

  /**
   * The UTC timestamp of the publication time for the post, page or thread on which the comment was posted.
   */
  postModified: Date | null;

  /**
   * The URL of the webpage that linked to the entry being requested.
   */
  referrer: URL | null;

  /**
   * The comment's type.
   * This string value specifies a `CommentType` constant or a made up value like `"registration"`.
   */
  type: string;

  /**
   * Creates a new comment.
   * @param author The comment's author.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(public author: Author | null, options: Partial<CommentOptions> = {}) {
    const {content = '', date = null, permalink = null, postModified = null, referrer = null, type = ''} = options;
    this.content = content;
    this.date = date;
    this.permalink = permalink;
    this.postModified = postModified;
    this.referrer = referrer;
    this.type = type;
  }

  /**
   * Creates a new comment from the specified JSON map.
   * @param map A JSON map representing a comment.
   * @return The instance corresponding to the specified JSON map.
   */
  static fromJson(map: JsonMap): Comment {
    const hasAuthor = Object.keys(map)
      .filter(key => /^comment_author/.test(key) || /^user/.test(key))
      .length > 0;

    const options = {
      content: typeof map.comment_content == 'string' ? map.comment_content : '',
      date: typeof map.comment_date_gmt == 'string' ? new Date(map.comment_date_gmt) : null,
      permalink: typeof map.permalink == 'string' ? new URL(map.permalink) : null,
      postModified: typeof map.comment_post_modified_gmt == 'string' ? new Date(map.comment_post_modified_gmt) : null,
      referrer: typeof map.referrer == 'string' ? new URL(map.referrer) : null,
      type: typeof map.comment_type == 'string' ? map.comment_type : ''
    };

    return new this(hasAuthor ? Author.fromJson(map) : null, options);
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  toJSON(): JsonMap {
    const map = this.author ? this.author.toJSON() : {};
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
   * @return The string representation of this object.
   */
  toString(): string {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }
}

/**
 * Defines the options of a `Comment` instance.
 */
export interface CommentOptions {

  /**
   * The comment's content.
   */
  content: string;

  /**
   * The UTC timestamp of the creation of the comment.
   */
  date: Date | null;

  /**
   * The permanent location of the entry the comment is submitted to.
   */
  permalink: URL | null;

  /**
   * The UTC timestamp of the publication time for the post, page or thread on which the comment was posted.
   */
  postModified: Date | null;

  /**
   * The URL of the webpage that linked to the entry being requested.
   */
  referrer: URL | null;

  /**
   * The comment's type.
   */
  type: string;
}

/**
 * Specifies the type of a comment.
 */
export enum CommentType {

  /**
   * A blog post.
   */
  blogPost = 'blog-post',

  /**
   * A blog comment.
   */
  comment = 'comment',

  /**
   * A contact form or feedback form submission.
   */
  contactForm = 'contact-form',

  /**
   * A top-level forum post.
   */
  forumPost = 'forum-post',

  /**
   * A message sent between just a few users.
   */
  message = 'message',

  /**
   * A [pingback](https://en.wikipedia.org/wiki/Pingback) post.
   */
  pingback = 'pingback',

  /**
   * A reply to a top-level forum post.
   */
  reply = 'reply',

  /**
   * A new user account.
   */
  signup = 'signup',

  /**
   * A [trackback](https://en.wikipedia.org/wiki/Trackback) post.
   */
  trackback = 'trackback',

  /**
   * A [Twitter](https://twitter.com) message.
   */
  tweet = 'tweet'
}
