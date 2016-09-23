/**
 * Implementation of the `akismet.Author` class.
 * @module core/author
 */

/**
 * Represents the author of a comment.
 */
module.exports = class Author {

  /**
   * Initializes a new instance of the class.
   * @param {object} [options] An object specifying values used to initialize this instance.
   */
  constructor(options = {}) {

    /**
     * The author's mail address.
     * @type {string}
     */
    this.email = '';

    /**
     * The author's IP address.
     * @type {string}
     */
    this.ipAddress = '';

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
    this.userAgent = '';

    // Initialize the instance.
    for(let key in options) {
      let option = options[key];
      if(this.hasOwnProperty(key) && typeof option != 'undefined') this[key] = option;
    }
  }

  /**
   * Creates a new author from the specified JSON string.
   * @param {(object|string)} json A JSON string, or an already parsed object, representing an author.
   * @returns {Author} The instance corresponding to the specified JSON object, or `null` if a parsing error occurred.
   */
  static fromJSON(json) {
    let map;
    if(typeof json != 'string') map = json;
    else {
      try { map = JSON.parse(json); }
      catch(e) { return null; }
    }

    return !map || typeof map != 'object' ? null : new Author({
      name: map.comment_author,
      email: map.comment_author_email,
      url: map.comment_author_url,
      userAgent: map.user_agent,
      ipAddress: map.user_ip,
      role: map.user_role
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @returns {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    let map = {};

    if(typeof this.name == 'string') map.comment_author = this.name;
    if(typeof this.email == 'string') map.comment_author_email = this.email;
    if(typeof this.url == 'string') map.comment_author_url = this.url;
    if(typeof this.userAgent == 'string') map.user_agent = this.userAgent;
    if(typeof this.ipAddress == 'string') map.user_ip = this.ipAddress;
    if(typeof this.role == 'string') map.user_role = this.role;

    return map;
  }

  /**
   * Returns a string representation of this object.
   * @returns {string} The string representation of this object.
   */
  toString() {
    let json = JSON.stringify(this.toJSON(), null, 2);
    return `${this.constructor.name} ${json}`;
  }
};
