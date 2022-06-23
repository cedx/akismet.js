import {version} from "node:process";
import {fetch} from "undici";
import {CheckResult} from "./check_result.js";
import pkgVersion from "./version.js";

/**
 * Submits comments to the [Akismet](https://akismet.com) service.
 */
export class Client {

	/**
	 * The Akismet API key.
	 * @readonly
	 * @type {string}
	 */
	apiKey;

	/**
	 * The base URL of the remote API endpoint.
	 * @readonly
	 * @type {URL}
	 */
	baseUrl;

	/**
	 * The front page or home URL of the instance making requests.
	 * @readonly
	 * @type {import("./blog.js").Blog}
	 */
	blog;

	/**
	 * Value indicating whether the client operates in test mode.
	 * @readonly
	 * @type {boolean}
	 */
	isTest;

	/**
	 * The user agent string to use when making requests.
	 * @readonly
	 * @type {string}
	 */
	userAgent;

	/**
	 * The final URL of the remote API endpoint.
	 * @type {URL}
	 */
	#endpoint;

	/**
	 * The response returned by the `submit-ham` and `submit-spam` endpoints when the outcome is a success.
	 * @type {string}
	 */
	static #successfulResponse = "Thanks for making the web a better place.";

	/**
	 * Creates a new client.
	 * @param {string} apiKey The Akismet API key.
	 * @param {import("./blog.js").Blog} blog The front page or home URL of the instance making requests.
	 * @param {Partial<ClientOptions>} [options] An object providing values to initialize this instance.
	 */
	constructor(apiKey, blog, options = {}) {
		const {baseUrl = "https://rest.akismet.com/1.1/", isTest = false, userAgent = `Node.js/${version.slice(1)} | Akismet/${pkgVersion}`} = options;
		this.apiKey = apiKey;
		this.baseUrl = new URL(baseUrl);
		this.blog = blog;
		this.isTest = isTest;
		this.userAgent = userAgent;
		this.#endpoint = new URL(`${this.baseUrl.protocol}//${this.apiKey}.${this.baseUrl.host}${this.baseUrl.pathname}`);
	}

	/**
	 * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
	 * @param {import("./comment.js").Comment} comment The comment to be checked.
	 * @returns {Promise<CheckResult>} A value indicating whether the specified comment is spam.
	 */
	async checkComment(comment) {
		const response = await this.#fetch(new URL("comment-check", this.#endpoint), comment.toJSON());
		return await response.text() == "false"
			? CheckResult.ham
			: response.headers.get("x-akismet-pro-tip") == "discard" ? CheckResult.pervasiveSpam : CheckResult.spam;
	}

	/**
	 * Submits the specified comment that was incorrectly marked as spam but should not have been.
	 * @param {import("./comment.js").Comment} comment The comment to be submitted.
	 * @returns {Promise<void>} Resolves once the comment has been submitted.
	 */
	async submitHam(comment) {
		const response = await this.#fetch(new URL("submit-ham", this.#endpoint), comment.toJSON());
		if (await response.text() != Client.#successfulResponse) throw new Error("Invalid server response.");
	}

	/**
	 * Submits the specified comment that was not marked as spam but should have been.
	 * @param {import("./comment.js").Comment} comment The comment to be submitted.
	 * @returns {Promise<void>} Resolves once the comment has been submitted.
	 */
	async submitSpam(comment) {
		const response = await this.#fetch(new URL("submit-spam", this.#endpoint), comment.toJSON());
		if (await response.text() != Client.#successfulResponse) throw new Error("Invalid server response.");
	}

	/**
	 * Checks the API key against the service database, and returns a value indicating whether it is valid.
	 * @returns {Promise<boolean>} `true` if the specified API key is valid, otherwise `false`.
	 */
	async verifyKey() {
		const response = await this.#fetch(new URL("verify-key", this.baseUrl), {key: this.apiKey});
		return await response.text() == "valid";
	}

	/**
	 * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
	 * @param {URL} endpoint The URL of the end point to query.
	 * @param {Record<string, string>} fields The fields describing the query body.
	 * @returns {Promise<import("undici").Response>} The server response.
	 */
	async #fetch(endpoint, fields) {
		const body = new URLSearchParams({...this.blog.toJSON(), ...fields});
		if (this.isTest) body.set("is_test", "1");

		const response = await fetch(endpoint.href, {
			method: "POST",
			headers: {"Content-Type": "application/x-www-form-urlencoded", "User-Agent": this.userAgent},
			body
		});

		if (!response.ok) throw new Error(await response.text());
		if (response.headers.has("x-akismet-alert-code")) throw new Error(response.headers.get("x-akismet-alert-msg") ?? "");
		if (response.headers.has("x-akismet-debug-help")) throw new Error(response.headers.get("x-akismet-debug-help") ?? "");
		return response;
	}
}

/**
 * Defines the options of a {@link Client} instance.
 * @typedef {object} ClientOptions
 * @property {string} baseUrl The base URL of the remote API endpoint.
 * @property {boolean} isTest Value indicating whether the client operates in test mode.
 * @property {string} userAgent The user agent string to use when making requests.
 */
