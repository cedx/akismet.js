/**
 * Represents the front page or home URL transmitted when making requests.
 */
export class Blog {

  /**
   * Creates a new blog.
   * @param {string|URL} url The blog or site URL.
   * @param {Object} [options] An object specifying values used to initialize this instance.
   */
  constructor(url, {charset = '', languages = []} = {}) {

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
     * @type {URL}
     */
    this.url = typeof url == 'string' ? new URL(url) : url;
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag](): string {
    return 'Blog';
  }

  /**
   * Creates a new blog from the specified JSON map.
   * @param A JSON map representing a blog.
   * @return The instance corresponding to the specified JSON map.
   */
  static fromJson(map: JsonMap): Blog {
    return new this(typeof map.blog == 'string' ? map.blog : null, {
      charset: typeof map.blog_charset == 'string' ? map.blog_charset : '',
      languages: typeof map.blog_lang == 'string' ? map.blog_lang.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0) : []
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  toJSON(): JsonMap {
    const map = {blog: this.url.href};
    if (this.charset.length) map.blog_charset = this.charset;
    if (this.languages.length) map.blog_lang = this.languages.join(',');
    return map;
  }

  /**
   * Returns a string representation of this object.
   * @return The string representation of this object.
   */
  toString(): string {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }
}
