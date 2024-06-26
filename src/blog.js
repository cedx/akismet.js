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
	 * @param {Partial<BlogOptions>} options An object providing values to initialize this instance.
	 */
	constructor(options = {}) {
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
	 * Returns a JSON representation of this object.
	 * @returns {Record<string, any>} The JSON representation of this object.
	 */
	toJSON() {
		/** @type {Record<string, any>} */ const map = {blog: this.url?.href ?? ""};
		if (this.charset) map.blog_charset = this.charset;
		if (this.languages.length) map.blog_lang = this.languages.join();
		return map;
	}
}

/**
 * Defines the options of a {@link Blog} instance.
 * @typedef {object} BlogOptions
 * @property {string} charset The character encoding for the values included in comments.
 * @property {string[]} languages The languages in use on the blog or site, in ISO 639-1 format.
 * @property {URL|string} url The blog or site URL.
 */
