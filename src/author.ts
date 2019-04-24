import {JsonMap} from './map';

/** Represents the author of a comment. */
export class Author {

  /** The author's mail address. */
  email: string;

  /** The author's name. */
  name: string;

  /** The role of the author. */
  role: string;

  /** The URL of the author's website. */
  url: URL | null;

  /**
   * Creates a new author.
   * @param ipAddress The author's IP address.
   * @param userAgent The author's user agent, that is the string identifying the Web browser used to submit comments.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(public ipAddress: string, public userAgent: string, options: Partial<AuthorOptions> = {}) {
    const {email = '', name = '', role = '', url = null} = options;
    this.email = email;
    this.name = name;
    this.role = role;
    this.url = url;
  }

  /**
   * Creates a new author from the specified JSON map.
   * @param map A JSON map representing an author.
   * @return The instance corresponding to the specified JSON map.
   */
  static fromJson(map: JsonMap): Author {
    return new Author(typeof map.user_ip == 'string' ? map.user_ip : '', typeof map.user_agent == 'string' ? map.user_agent : '', {
      email: typeof map.comment_author_email == 'string' ? map.comment_author_email : '',
      name: typeof map.comment_author == 'string' ? map.comment_author : '',
      role: typeof map.user_role == 'string' ? map.user_role : '',
      url: typeof map.comment_author_url == 'string' ? new URL(map.comment_author_url) : null
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  toJSON(): JsonMap {
    const map: JsonMap = {
      user_agent: this.userAgent,
      user_ip: this.ipAddress
    };

    if (this.name.length) map.comment_author = this.name;
    if (this.email.length) map.comment_author_email = this.email;
    if (this.url) map.comment_author_url = this.url.href;
    if (this.role.length) map.user_role = this.role;
    return map;
  }
}

/** Defines the options of a [[Author]] instance. */
export interface AuthorOptions {

  /** The author's mail address. */
  email: string;

  /** The author's name. */
  name: string;

  /** The role of the author. */
  role: string;

  /** The URL of the author's website. */
  url: URL | null;
}
