/**
 * Represents the author of a comment.
 */
export class Author {

  /**
   * Initializes a new instance of the class.
   * @param {string} [ipAddress] The author's IP address.
   * @param {string} [userAgent] The author's user agent.
   */
  constructor(ipAddress = '', userAgent = '') {

    /**
     * The author's mail address.
     * @type {string}
     */
    this.email = '';

    /**
     * The author's IP address.
     * @type {string}
     */
    this.ipAddress = ipAddress;

    /**
     * The author's name.
     * @type {string}
     */
    this.name = '';

    /**
     * The role of the author.
     * If you set it to `"administrator"`, Akismet will always return `false`.
     * @type {string}
     */
    this.role = '';

    /**
     * The URL of the author's website.
     * @type {string}
     */
    this.url = '';

    /**
     * The author's user agent, that is the string identifying the Web browser used to submit comments.
     * @type {string}
     */
    this.userAgent = userAgent;
  }

  /**
   * Creates a new author from the specified JSON map.
   * @param {object} map A JSON map representing an author.
   * @return {Author} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJSON(map) {
    if (!map || typeof map != 'object') return null;

    let author = new Author(typeof map.user_ip == 'string' ? map.user_ip : '');
    author.email = typeof map.comment_author_email == 'string' ? map.comment_author_email : '';
    author.name = typeof map.comment_author == 'string' ? map.comment_author : '';
    author.role = typeof map.user_role == 'string' ? map.user_role : '';
    author.url = typeof map.comment_author_url == 'string' ? map.comment_author_url : '';
    author.userAgent = typeof map.user_agent == 'string' ? map.user_agent : '';
    return author;
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
    return `${this.constructor.name} ${JSON.stringify(this)}`;
  }
}
