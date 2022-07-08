/**
 * Represents the author of a comment.
 */
export class Author {

	/**
	 * The author's mail address. If you set it to `"akismet-guaranteed-spam@example.com"`, Akismet will always return `true`.
	 * @type {string}
	 */
	email;

	/**
	 * The author's IP address.
	 * @type {string}
	 */
	ipAddress;

	/**
	 * The author's name. If you set it to `"viagra-test-123"`, Akismet will always return `true`.
	 * @type {string}
	 */
	name;

	/**
	 * The author's role. If you set it to `"administrator"`, Akismet will always return `false`.
	 * @type {AuthorRole}
	 */
	role;

	/**
	 * The URL of the author's website.
	 * @type {URL|null}
	 */
	url;

	/**
	 * The author's user agent, that is the string identifying the Web browser used to submit comments.
	 * @type {string}
	 */
	userAgent;

	/**
	 * Creates a new author.
	 * @param {Partial<AuthorOptions>} [options] An object providing values to initialize this instance.
	 */
	constructor(options = {}) {
		this.email = options.email ?? "";
		this.ipAddress = options.ipAddress ?? "";
		this.name = options.name ?? "";
		this.role = options.role ?? "";
		this.url = options.url ? new URL(options.url) : null;
		this.userAgent = options.userAgent ?? "";
	}

	/**
	 * Creates a new author from the specified JSON object.
	 * @param {Record<string, any>} json A JSON object representing an author.
	 * @returns {Author} The instance corresponding to the specified JSON object.
	 */
	static fromJson(json) {
		return new this({
			email: typeof json.comment_author_email == "string" ? json.comment_author_email : "",
			ipAddress: typeof json.user_ip == "string" ? json.user_ip : "",
			name: typeof json.comment_author == "string" ? json.comment_author : "",
			role: typeof json.user_role == "string" ? json.user_role : "",
			url: typeof json.comment_author_url == "string" ? json.comment_author_url : "",
			userAgent: typeof json.user_agent == "string" ? json.user_agent : ""
		});
	}

	/**
	 * Converts this object to a map in JSON format.
	 * @returns {Record<string, any>} The map in JSON format corresponding to this object.
	 */
	toJSON() {
		/** @type {Record<string, string>} */
		const map = {user_ip: this.ipAddress};
		if (this.email) map.comment_author_email = this.email;
		if (this.name) map.comment_author = this.name;
		if (this.role) map.user_role = this.role;
		if (this.url) map.comment_author_url = this.url.href;
		if (this.userAgent) map.user_agent = this.userAgent;
		return map;
	}
}

/**
 * Defines the options of an {@link Author} instance.
 * @typedef {object} AuthorOptions
 * @property {string} email The author's mail address.
 * @property {string} ipAddress The author's IP address.
 * @property {string} name The author's name.
 * @property {AuthorRole} role The author's role.
 * @property {string} url The URL of the author's website.
 * @property {string} userAgent The author's user agent, that is the string identifying the Web browser used to submit comments.
 */

/**
 * Specifies the role of an author.
 * @enum {string}
 */
export const AuthorRole = Object.freeze({

	/** The author is an administrator. */
	administrator: "administrator"
});
