/**
 * Defines the options of an {@link Author} instance.
 * @typedef {object} AuthorOptions
 * @property {string} [email] The author's mail address.
 * @property {string} [name] The author's name.
 * @property {string} [role] The role of the author.
 * @property {?URL} [url] The URL of the author's website.
 */

/** Represents the author of a comment. */
export class Author {

  /**
   * Creates a new author.
   * @param {string} ipAddress The author's IP address.
   * @param {string} userAgent The author's user agent, that is the string identifying the Web browser used to submit comments.
   * @param {AuthorOptions} [options] An object specifying values used to initialize this instance.
   */
  constructor(ipAddress, userAgent, options = {}) {
    const {email = '', name = '', role = '', url = null} = options;

    /**
     * The author's mail address.
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
     * @type {string}
     */
    this.name = name;

    /**
     * The role of the author.
     * @type {string}
     */
    this.role = role;

    /**
     * The URL of the author's website.
     * @type {?URL}
     */
    this.url = url;

    /**
     * The author's user agent, that is the string identifying the Web browser used to submit comments.
     * @type {string}
     */
    this.userAgent = userAgent;
  }

  /**
   * Creates a new author from the specified JSON map.
   * @param {Object<string, *>} map A JSON map representing an author.
   * @return {Author} The instance corresponding to the specified JSON map.
   */
  static fromJson(map) {
    return new Author(typeof map.user_ip == 'string' ? map.user_ip : '', typeof map.user_agent == 'string' ? map.user_agent : '', {
      email: typeof map.comment_author_email == 'string' ? map.comment_author_email : '',
      name: typeof map.comment_author == 'string' ? map.comment_author : '',
      role: typeof map.user_role == 'string' ? map.user_role : '',
      url: typeof map.comment_author_url == 'string' ? new URL(map.comment_author_url) : null
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {Object<string, *>} The map in JSON format corresponding to this object.
   */
  toJSON() {
    const map = {
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
