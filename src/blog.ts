import {JsonObject} from './json.js';

/** Represents the front page or home URL transmitted when making requests. */
export class Blog {

  /** The character encoding for the values included in comments. */
  charset: string;

  /** The languages in use on the blog or site, in ISO 639-1 format. */
  languages: string[];

  /**
   * Creates a new blog.
   * @param url The blog or site URL.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(public url?: URL, options: Partial<BlogOptions> = {}) {
    const {charset = '', languages = []} = options;
    this.charset = charset;
    this.languages = languages;
  }

  /**
   * Creates a new blog from the specified JSON object.
   * @param map A JSON object representing a blog.
   * @return The instance corresponding to the specified JSON object.
   */
  static fromJson(map: JsonObject): Blog {
    return new Blog(typeof map.blog == 'string' ? new URL(map.blog) : undefined, {
      charset: typeof map.blog_charset == 'string' ? map.blog_charset : '',
      languages: typeof map.blog_lang == 'string' ? map.blog_lang.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0) : []
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  toJSON(): JsonObject {
    /* eslint-disable @typescript-eslint/camelcase */
    const map: JsonObject = {blog: this.url ? this.url.href : ''};
    if (this.charset.length) map.blog_charset = this.charset;
    if (this.languages.length) map.blog_lang = this.languages.join(',');
    return map;
    /* eslint-enable @typescript-eslint/camelcase */
  }
}

/** Defines the options of a [[Blog]] instance. */
export interface BlogOptions {

  /** The character encoding for the values included in comments. */
  charset: string;

  /** The languages in use on the blog or site, in ISO 639-1 format. */
  languages: string[];
}
