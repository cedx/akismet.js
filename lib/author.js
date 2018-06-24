'use strict';

/**
 * Represents the author of a comment.
 */
class Author {

  /**
   * Creates a new author.
   * @param {string} ipAddress The author's IP address.
   * @param {string} userAgent The author's user agent.
   * @param {Object} [options] An object specifying values used to initialize this instance.
   */
  constructor(ipAddress, userAgent, {email = '', name = '', role = '', url = null} = {}) {

    /**
     * The author's mail address.
     * If you set it to `"akismet-guaranteed-spam@example.com"`, Akismet will always return `true`.
     * @type {string}
     */
    this.email = email;

    /**
     * The author's IP address.
     * @type {string}
     */
    this.ipAddress = ipAddress;

    /**
     * The author's name.
     * If you set it to `"viagra-test-123"`, Akismet will always return `true`.
     * @type {string}
     */
    this.name = name;

    /**
     * The role of the author.
     * If you set it to `"administrator"`, Akismet will always return `false`.
     * @type {string}
     */
    this.role = role;

    /**
     * The URL of the author's website.
     * @type {URL}
     */
    this.url = typeof url == 'string' ? new URL(url) : url;

    /**
     * The author's user agent, that is the string identifying the Web browser used to submit comments.
     * @type {string}
     */
    this.userAgent = userAgent;
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'Author';
  }

  /**
   * Creates a new author from the specified JSON map.
   * @param {Object} map A JSON map representing an author.
   * @return {Author} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJson(map) {
    if (!map || typeof map != 'object') return null;

    let options = {
      email: typeof map.comment_author_email == 'string' ? map.comment_author_email : '',
      name: typeof map.comment_author == 'string' ? map.comment_author : '',
      role: typeof map.user_role == 'string' ? map.user_role : '',
      url: typeof map.comment_author_url == 'string' ? map.comment_author_url : null
    };

    return new this(
      typeof map.user_ip == 'string' ? map.user_ip : '',
      typeof map.user_agent == 'string' ? map.user_agent : '',
      options
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {Object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    let map = {
      user_agent: this.userAgent,
      user_ip: this.ipAddress
    };

    if (this.name.length) map.comment_author = this.name;
    if (this.email.length) map.comment_author_email = this.email;
    if (this.url) map.comment_author_url = this.url.href;
    if (this.role.length) map.user_role = this.role;
    return map;
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }
}

// Module exports.
exports.Author = Author;
