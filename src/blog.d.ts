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
	constructor(options?: BlogOptions);

	/**
	 * Creates a new blog from the specified JSON object.
	 * @param json A JSON object representing a blog.
	 * @returns The instance corresponding to the specified JSON object.
	 */
	static fromJson(json: Record<string, any>): Blog;

	/**
	 * Returns a JSON representation of this object.
	 * @returns The JSON representation of this object.
	 */
	toJSON(): Record<string, any>;
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
	languages: Array<string>;

	/**
	 * The blog or site URL.
	 */
	url: URL|string;
}>;
