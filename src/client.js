import {CheckResult} from "./check_result.js";

/**
 * Submits comments to the [Akismet](https://akismet.com) service.
 */
export class Client {

	/**
	 * The response returned by the `submit-ham` and `submit-spam` endpoints when the outcome is a success.
	 * @type {string}
	 * @readonly
	 */
	static #success = "Thanks for making the web a better place.";

	/**
	 * The package version.
	 * @type {string}
	 * @readonly
	 */
	static #version = "16.1.0";

	/**
	 * The Akismet API key.
	 * @type {string}
	 * @readonly
	 */
	apiKey;

	/**
	 * The base URL of the remote API endpoint.
	 * @type {URL}
	 * @readonly
	 */
	baseUrl;

	/**
	 * The front page or home URL of the instance making requests.
	 * @type {import("./blog.js").Blog}
	 * @readonly
	 */
	blog;

	/**
	 * Value indicating whether the client operates in test mode.
	 * @type {boolean}
	 * @readonly
	 */
	isTest;

	/**
	 * The user agent string to use when making requests.
	 * @type {string}
	 * @readonly
	 */
	userAgent;

	/**
	 * Creates a new client.
	 * @param {string} apiKey The Akismet API key.
	 * @param {import("./blog.js").Blog} blog The front page or home URL of the instance making requests.
	 * @param {Partial<ClientOptions>} options An object providing values to initialize this instance.
	 */
	constructor(apiKey, blog, options = {}) {
		const {baseUrl = "https://rest.akismet.com"} = options;
		const url = baseUrl instanceof URL ? baseUrl.href : baseUrl;

		this.apiKey = apiKey;
		this.baseUrl = new URL(url.endsWith("/") ? url : `${url}/`);
		this.blog = blog;
		this.isTest = options.isTest ?? false;
		this.userAgent = options.userAgent ?? `${navigator.userAgent} | Akismet/${Client.#version}`;
	}

	/**
	 * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
	 * @param {import("./comment.js").Comment} comment The comment to be checked.
	 * @returns {Promise<CheckResult>} A value indicating whether the specified comment is spam.
	 */
	async checkComment(comment) {
		const response = await this.#fetch("1.1/comment-check", comment.toJSON());
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
		const response = await this.#fetch("1.1/submit-ham", comment.toJSON());
		if (await response.text() != Client.#success) throw Error("Invalid server response.");
	}

	/**
	 * Submits the specified comment that was not marked as spam but should have been.
	 * @param {import("./comment.js").Comment} comment The comment to be submitted.
	 * @returns {Promise<void>} Resolves once the comment has been submitted.
	 */
	async submitSpam(comment) {
		const response = await this.#fetch("1.1/submit-spam", comment.toJSON());
		if (await response.text() != Client.#success) throw Error("Invalid server response.");
	}

	/**
	 * Checks the API key against the service database, and returns a value indicating whether it is valid.
	 * @returns {Promise<boolean>} `true` if the specified API key is valid, otherwise `false`.
	 */
	async verifyKey() {
		try {
			const response = await this.#fetch("1.1/verify-key", {});
			return await response.text() == "valid";
		}
		catch {
			return false;
		}
	}

	/**
	 * Queries the service by posting the specified fields to a given end point, and returns the response.
	 * @param {string} endpoint The URL of the end point to query.
	 * @param {Record<string, any>} fields The fields describing the query body.
	 * @returns {Promise<Response>} The server response.
	 */
	async #fetch(endpoint, fields) {
		const body = new URLSearchParams({...this.blog.toJSON(), api_key: this.apiKey});
		if (this.isTest) body.set("is_test", "1");

		for (const [key, value] of Object.entries(fields))
			if (!Array.isArray(value)) body.set(key, String(value));
			else {
				let index = 0;
				for (const item of value) body.set(`${key}[${index++}]`, String(item));
			}

		const response = await fetch(new URL(endpoint, this.baseUrl), {method: "POST", headers: {"user-agent": this.userAgent}, body});
		if (!response.ok) throw Error(`${response.status} ${response.statusText}`);

		const {headers} = response;
		if (headers.has("x-akismet-alert-code")) throw Error(`${headers.get("x-akismet-alert-code")} ${headers.get("x-akismet-alert-msg")}`);
		if (headers.has("x-akismet-debug-help")) throw Error(/** @type {string} */ (headers.get("x-akismet-debug-help")));
		return response;
	}
}

/**
 * Defines the options of a {@link Client} instance.
 * @typedef {object} ClientOptions
 * @property {URL|string} baseUrl The base URL of the remote API endpoint.
 * @property {boolean} isTest Value indicating whether the client operates in test mode.
 * @property {string} userAgent The user agent string to use when making requests.
 */
