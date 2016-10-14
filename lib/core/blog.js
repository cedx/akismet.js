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
   * @param {object} [options] An object specifying values used to initialize this instance.
   */
  constructor(options = {}) {

    /**
     * The character encoding for the values included in comments.
     * @type {string}
     */
    this.charset = '';

    /**
     * The language(s) in use on the blog or site, in ISO 639-1 format, comma-separated.
     * @type {string}
     */
    this.language = '';

    /**
     * The blog or site URL.
     * @type {string}
     */
    this.url = '';

    // Initialize the instance.
    for (let key in options) {
      let option = options[key];
      if (this.hasOwnProperty(key) && typeof option != 'undefined') this[key] = option;
    }
  }

  /**
   * Creates a new blog from the specified JSON map.
   * @param {object} map A JSON map representing a blog.
   * @returns {Blog} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJSON(map) {
    return !map || typeof map != 'object' ? null : new Blog({
      charset: typeof map.blog_charset == 'string' ? map.blog_charset : '',
      language: typeof map.blog_lang == 'string' ? map.blog_lang : '',
      url: typeof map.blog == 'string' ? map.blog : ''
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @returns {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    let map = {};

    if (this.url.length) map.blog = this.url;
    if (this.charset.length) map.blog_charset = this.charset;
    if (this.language.length) map.blog_lang = this.language;

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
