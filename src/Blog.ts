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
	languages: Set<string>;

	/**
	 * The blog or site URL.
	 */
	url: URL|null;

	/**
	 * Creates a new blog.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options: BlogOptions = {}) {
		this.charset = options.charset ?? "";
		this.languages = new Set(options.languages ?? []);
		this.url = options.url ? new URL(options.url) : null;
	}

	/**
	 * Returns a JSON representation of this object.
	 * @returns The JSON representation of this object.
	 */
	toJSON(): Record<string, any> {
		const map: Record<string, any> = {blog: this.url?.href ?? ""};
		if (this.charset) map.blog_charset = this.charset;
		if (this.languages.size) map.blog_lang = Array.from(this.languages).join(",");
		return map;
	}
}

/**
 * Defines the options of a {@link Blog} instance.
 */
export type BlogOptions = Partial<{

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
}>;
