/**
 * Represents the author of a comment.
 */
export class Author {

	/**
	 * The author's mail address. If you set it to `"akismet-guaranteed-spam@example.com"`, Akismet will always return `true`.
	 */
	email: string;

	/**
	 * The author's IP address.
	 */
	ipAddress: string;

	/**
	 * The author's name. If you set it to `"viagra-test-123"`, Akismet will always return `true`.
	 */
	name: string;

	/**
	 * The author's role. If you set it to `"administrator"`, Akismet will always return `false`.
	 */
	role: string;

	/**
	 * The URL of the author's website.
	 */
	url: URL|null;

	/**
	 * The author's user agent, that is the string identifying the Web browser used to submit comments.
	 */
	userAgent: string;

	/**
	 * Creates a new author.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options?: AuthorOptions);

	/**
	 * Creates a new author from the specified JSON object.
	 * @param json A JSON object representing an author.
	 * @returns The instance corresponding to the specified JSON object.
	 */
	static fromJson(json: Record<string, any>): Author;

	/**
	 * Returns a JSON representation of this object.
	 * @returns The JSON representation of this object.
	 */
	toJSON(): Record<string, any>;
}

/**
 * Defines the options of an {@link Author} instance.
 */
export type AuthorOptions = Partial<{

	/**
	 * The author's mail address. If you set it to `"akismet-guaranteed-spam@example.com"`, Akismet will always return `true`.
	 */
	email: string;

	/**
	 * The author's IP address.
	 */
	ipAddress: string;

	/**
	 * The author's name. If you set it to `"viagra-test-123"`, Akismet will always return `true`.
	 */
	name: string;

	/**
	 * The author's role. If you set it to `"administrator"`, Akismet will always return `false`.
	 */
	role: string;

	/**
	 * The URL of the author's website.
	 */
	url: URL|string;

	/**
	 * The author's user agent, that is the string identifying the Web browser used to submit comments.
	 */
	userAgent: string;
}>;

/**
 * Specifies the role of an author.
 */
export const AuthorRole: Readonly<{

	/**
	 * The author is an administrator.
	 */
	administrator: "administrator"
}>;

/**
 * Specifies the role of an author.
 */
export type AuthorRole = typeof AuthorRole[keyof typeof AuthorRole];
