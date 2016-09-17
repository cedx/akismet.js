/**
 * Implementation of the `akismet.Blog` class.
 * @module core/blog
 */

/**
 * Represents the front page or home URL transmitted when making requests.
 */
module.exports = class Blog {

  /**
   * Initializes a new instance of the class.
   * @param {string} url The blog or site URL.
   * @param {object} [options] An object specifying additional values used to initialize this instance.
   */
  constructor(url, options = {}) {

    /**
     * The character encoding for the values included in comments.
     * @type {string}
     */
    this.charset = null;

    /**
     * The language(s) in use on the blog or site, in ISO 639-1 format, comma-separated.
     * @type {string}
     */
    this.language = null;

    /**
     * The blog or site URL.
     * @type {string}
     */
    this.url = typeof url == 'string' ? url : null;

    // Initialize the instance.
    for(let key in options) {
      let option = options[key];
      if(this.hasOwnProperty(key) && typeof option != 'undefined') this[key] = option;
    }
  }

  /**
   * Creates a new author from the specified JSON string.
   * @param {(object|string)} json A JSON string, or an already parsed object, representing an author.
   * @returns {Blog} The instance corresponding to the specified JSON object, or `null` if a parsing error occurred.
   */
  static fromJSON(json) {
    let map;
    if(typeof json != 'string') map = json;
    else {
      try { map = JSON.parse(json); }
      catch(e) { return null; }
    }

    return !map || typeof map != 'object' ? null : new Blog(map.blog, {
      charset: map.blog_charset,
      language: map.blog_lang
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @returns {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    let map = {};

    if(typeof this.url == 'string') map.blog = this.url;
    if(typeof this.charset == 'string') map.blog_charset = this.charset;
    if(typeof this.language == 'string') map.blog_lang = this.language;

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
