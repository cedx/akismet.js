/**
 * Represents the front page or home URL transmitted when making requests.
 */
export class Blog {

	/**
	 * The character encoding for the values included in comments.
	 */
	charset: string;

	/**
	 * The languages in use on the blog or site, in ISO 639-1 format.
	 */
	languages: string[];

	/**
	 * The blog or site URL.
	 */
	url: URL|null;

	/**
	 * Creates a new blog.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options: Partial<BlogOptions>) {
		this.charset = options.charset ?? "";
		this.languages = options.languages ?? [];
		this.url = options.url ? new URL(options.url) : null;
	}

	/**
	 * Creates a new blog from the specified JSON object.
	 * @param json A JSON object representing a blog.
	 * @returns The instance corresponding to the specified JSON object.
	 */
	static fromJson(json: Record<string, any>): Blog {
		return new this({
			charset: typeof json.blog_charset == "string" ? json.blog_charset : "",
			languages: typeof json.blog_lang == "string" ? json.blog_lang.split(",").map(language => language.trim()) : [],
			url: typeof json.blog == "string" ? json.blog : ""
		});
	}

	/**
	 * Converts this object to a map in JSON format.
	 * @returns The map in JSON format corresponding to this object.
	 */
	toJSON(): Record<string, any> {
		const map: Record<string, string> = {blog: this.url ? this.url.href : ""};
		if (this.charset) map.blog_charset = this.charset;
		if (this.languages.length) map.blog_lang = this.languages.join();
		return map;
	}
}

/**
 * Defines the options of a {@link Blog} instance.
 */
export interface BlogOptions {

	/**
	 * The character encoding for the values included in comments.
	 */
	charset: string;

	/**
	 * The languages in use on the blog or site, in ISO 639-1 format.
	 */
	languages: string[];

	/**
	 * The blog or site URL.
	 */
	url: URL|string;
}
