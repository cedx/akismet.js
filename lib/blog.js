/**
 * Represents the front page or home URL transmitted when making requests.
 */
export class Blog {

	/**
	 * The character encoding for the values included in comments.
	 * @type {string}
	 */
	charset;

	/**
	 * The languages in use on the blog or site, in ISO 639-1 format.
	 * @type {string[]}
	 */
	languages;

	/**
	 * The blog or site URL.
	 * @type {URL}
	 */
	url;

	/**
	 * Creates a new blog.
	 * @param {string} url The blog or site URL.
	 * @param {Partial<BlogOptions>} [options] An object providing values to initialize this instance.
	 */
	constructor(url, options = {}) {
		const {charset = "", languages = []} = options;
		this.charset = charset;
		this.languages = languages;
		this.url = new URL(url);
	}

	/**
	 * Creates a new blog from the specified JSON object.
	 * @param {Record<string, any>} map A JSON object representing a blog.
	 * @returns {Blog} The instance corresponding to the specified JSON object.
	 */
	static fromJson(map) {
		return new this(typeof map.blog == "string" ? map.blog : "", {
			charset: typeof map.blog_charset == "string" ? map.blog_charset : "",
			languages: typeof map.blog_lang == "string" ? map.blog_lang.split(",").map(language => language.trim()) : []
		});
	}

	/**
	 * Converts this object to a map in JSON format.
	 * @returns {Record<string, any>} The map in JSON format corresponding to this object.
	 */
	toJSON() {
		/** @type {Record<string, string>} */
		const map = {blog: this.url ? this.url.href : ""};
		if (this.charset) map.blog_charset = this.charset;
		if (this.languages.length) map.blog_lang = this.languages.join(",");
		return map;
	}
}

/**
 * Defines the options of a {@link Blog} instance.
 * @typedef {object} BlogOptions
 * @property {string} charset The character encoding for the values included in comments.
 * @property {string[]} languages The languages in use on the blog or site, in ISO 639-1 format.
 */
