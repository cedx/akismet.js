/**
 * Represents the front page or home URL transmitted when making requests.
 */
export class Blog {

  /**
   * Initializes a new instance of the class.
   * @param {object} [options] An object specifying values used to initialize this instance.
   */
  constructor(options = {}) {

    /**
     * The character encoding for the values included in comments.
     * @type {string}
     */
    this.charset = typeof options.charset == 'string' ? options.charset : '';

    /**
     * The languages in use on the blog or site, in ISO 639-1 format.
     * @type {string[]}
     */
    this.languages = [];
    if (Array.isArray(options.languages)) this.languages = options.languages;
    else if (typeof options.languages == 'string') this.languages = options.languages.split(',')
      .map(language => language.trim())
      .filter(language => language.length > 0);

    /**
     * The blog or site URL.
     * @type {string}
     */
    this.url = typeof options.url == 'string' ? options.url : '';
  }

  /**
   * Creates a new blog from the specified JSON map.
   * @param {object} map A JSON map representing a blog.
   * @return {Blog} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJSON(map) {
    return !map || typeof map != 'object' ? null : new Blog({
      charset: map.blog_charset,
      languages: map.blog_lang,
      url: map.blog
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    let map = {};
    if (this.url.length) map.blog = this.url;
    if (this.charset.length) map.blog_charset = this.charset;
    if (this.languages.length) map.blog_lang = this.languages.join(',');
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
