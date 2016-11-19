/**
 * Represents the author of a comment.
 */
export class Author {

  /**
   * Initializes a new instance of the class.
   * @param {object} [options] An object specifying values used to initialize this instance.
   */
  constructor(options = {}) {

    /**
     * The author's mail address.
     * @type {string}
     */
    this.email = typeof options.email == 'string' ? options.email : '';

    /**
     * The author's IP address.
     * @type {string}
     */
    this.ipAddress = typeof options.ipAddress == 'string' ? options.ipAddress : '';

    /**
     * The author's name.
     * @type {string}
     */
    this.name = typeof options.name == 'string' ? options.name : '';

    /**
     * The role of the author.
     * If you set it to `"administrator"`, Akismet will always return `false`.
     * @type {string}
     */
    this.role = typeof options.role == 'string' ? options.role : '';

    /**
     * The URL of the author's website.
     * @type {string}
     */
    this.url = typeof options.url == 'string' ? options.url : '';

    /**
     * The author's user agent, that is the string identifying the Web browser used to submit comments.
     * @type {string}
     */
    this.userAgent = typeof options.userAgent == 'string' ? options.userAgent : '';
  }

  /**
   * Creates a new author from the specified JSON map.
   * @param {object} map A JSON map representing an author.
   * @return {Author} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJSON(map) {
    return !map || typeof map != 'object' ? null : new Author({
      email: map.comment_author_email,
      ipAddress: map.user_ip,
      name: map.comment_author,
      role: map.user_role,
      url: map.comment_author_url,
      userAgent: map.user_agent
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    let map = {};
    if (this.name.length) map.comment_author = this.name;
    if (this.email.length) map.comment_author_email = this.email;
    if (this.url.length) map.comment_author_url = this.url;
    if (this.userAgent.length) map.user_agent = this.userAgent;
    if (this.ipAddress.length) map.user_ip = this.ipAddress;
    if (this.role.length) map.user_role = this.role;
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
