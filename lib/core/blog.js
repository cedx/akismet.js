/**
 * Defines the options of a {@link Blog} instance.
 * @typedef {object} BlogOptions
 * @property {string} [charset] The character encoding for the values included in comments.
 * @property {string[]} [languages] The languages in use on the blog or site, in ISO 639-1 format.
 */

/** Represents the front page or home URL transmitted when making requests. */
export class Blog {

  /**
   * Creates a new blog.
   * @param {?URL} url The blog or site URL.
   * @param {BlogOptions} [options] An object specifying values used to initialize this instance.
   */
  constructor(url, options = {}) {
    const {charset = '', languages = []} = options;

    /**
     * The character encoding for the values included in comments.
     * @type {string}
     */
    this.charset = charset;

    /**
     * The languages in use on the blog or site, in ISO 639-1 format.
     * @type {string[]}
     */
    this.languages = languages;

    /**
     * The blog or site URL.
     * @type {?URL}
     */
    this.url = url;
  }

  /**
   * Creates a new blog from the specified JSON map.
   * @param {object} map A JSON map representing a blog.
   * @return {Blog} The instance corresponding to the specified JSON map.
   */
  static fromJson(map) {
    return new Blog(typeof map.blog == 'string' ? new URL(map.blog) : null, {
      charset: typeof map.blog_charset == 'string' ? map.blog_charset : '',
      languages: typeof map.blog_lang == 'string' ? map.blog_lang.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0) : []
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    const map = {blog: this.url ? this.url.href : ''};
    if (this.charset.length) map.blog_charset = this.charset;
    if (this.languages.length) map.blog_lang = this.languages.join(',');
    return map;
  }
}
