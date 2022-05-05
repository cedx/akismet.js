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
	 * @type {string}
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
	 * @param {string} ipAddress The author's IP address.
	 * @param {string} userAgent The author's user agent, that is the string identifying the Web browser used to submit comments.
	 * @param {Partial<AuthorOptions>} [options] An object providing values to initialize this instance.
	 */
	constructor(ipAddress, userAgent, options = {}) {
		this.ipAddress = ipAddress;
		this.userAgent = userAgent;

		const {email = "", name = "", role = "", url} = options;
		this.email = email;
		this.name = name;
		this.role = role;
		this.url = url ? new URL(url) : null;
	}

	/**
	 * Creates a new author from the specified JSON object.
	 * @param {Record<string, any>} map A JSON object representing an author.
	 * @returns The instance corresponding to the specified JSON object.
	 */
	static fromJson(map) {
		return new this(typeof map.user_ip == "string" ? map.user_ip : "", typeof map.user_agent == "string" ? map.user_agent : "", {
			email: typeof map.comment_author_email == "string" ? map.comment_author_email : "",
			name: typeof map.comment_author == "string" ? map.comment_author : "",
			role: typeof map.user_role == "string" ? map.user_role : "",
			url: typeof map.comment_author_url == "string" ? map.comment_author_url : null
		});
	}

	/**
	 * Converts this object to a map in JSON format.
	 * @returns {Record<string, any>} The map in JSON format corresponding to this object.
	 */
	toJSON() {
		/** @type {Record<string, string>} */
		const map = {user_agent: this.userAgent, user_ip: this.ipAddress};
		if (this.name.length) map.comment_author = this.name;
		if (this.email.length) map.comment_author_email = this.email;
		if (this.url) map.comment_author_url = this.url.href;
		if (this.role.length) map.user_role = this.role;
		return map;
	}
}

/**
 * Defines the options of an {@link Author} instance.
 * @typedef {object} AuthorOptions
 * @property {string} email The author's mail address.
 * @property {string} name The author's name.
 * @property {string} role The author's role.
 * @property {string|null} url The URL of the author's website.
 */

/**
 * Specifies the role of an author.
 * @enum {string}
 */
export const AuthorRole = Object.freeze({

	/** The author is an administrator. */
	administrator: "administrator"
});
