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
	 * @type {URL|null}
	 */
	url;

	/**
	 * Creates a new blog.
	 * @param {BlogOptions} options An object providing values to initialize this instance.
	 */
	constructor(options) {
		this.charset = options.charset ?? "";
		this.languages = options.languages ?? [];
		this.url = options.url ? new URL(options.url) : null;
	}

	/**
	 * Creates a new blog from the specified JSON object.
	 * @param {Record<string, any>} json A JSON object representing a blog.
	 * @returns {Blog} The instance corresponding to the specified JSON object.
	 */
	static fromJson(json) {
		return new this({
			charset: typeof json.blog_charset == "string" ? json.blog_charset : "",
			languages: typeof json.blog_lang == "string" ? json.blog_lang.split(",").map(language => language.trim()) : [],
			url: typeof json.blog == "string" ? json.blog : ""
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
		if (this.languages.length) map.blog_lang = this.languages.join();
		return map;
	}
}

/**
 * Defines the options of a {@link Blog} instance.
 * @typedef {object} BlogOptions
 * @property {string} [charset] The character encoding for the values included in comments.
 * @property {string[]} [languages] The languages in use on the blog or site, in ISO 639-1 format.
 * @property {string} url The blog or site URL.
 */
