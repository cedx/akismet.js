import {version} from "node:process";
import {CheckResult} from "./check_result.js";
import pkg from "../package.json" assert {type: "json"};

/**
 * Submits comments to the [Akismet](https://akismet.com) service.
 */
export class Client {

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
	 * @param {ClientOptions} [options] An object providing values to initialize this instance.
	 */
	constructor(apiKey, blog, options = {}) {
		this.apiKey = apiKey;
		this.baseUrl = new URL(options.baseUrl ?? "https://rest.akismet.com/1.1/");
		this.blog = blog;
		this.isTest = options.isTest ?? false;
		this.userAgent = options.userAgent ?? `Node.js/${version.slice(1)} | Akismet/${pkg.version}`;
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
			: response.headers.get("X-akismet-pro-tip") == "discard" ? CheckResult.pervasiveSpam : CheckResult.spam;
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
	 * Queries the service by posting the specified fields to a given end point, and returns the response.
	 * @param {URL} endpoint The URL of the end point to query.
	 * @param {Record<string, string>} fields The fields describing the query body.
	 * @returns {Promise<Response>} The server response.
	 */
	async #fetch(endpoint, fields) {
		const body = new URLSearchParams({...this.blog.toJSON(), ...fields});
		if (this.isTest) body.set("is_test", "1");

		const params = {
			method: "POST",
			headers: {"content-type": "application/x-www-form-urlencoded", "user-agent": this.userAgent},
			body
		};

		const response = await fetch(endpoint, params);
		if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

		if (response.headers.has("X-akismet-alert-code")) {
			const code = response.headers.get("X-akismet-alert-code") ?? "";
			throw Object.assign(new Error(response.headers.get("X-akismet-alert-msg") ?? ""), {name: code ? `AkismetError #${code}` : "AkismetError"});
		}

		if (response.headers.has("X-akismet-debug-help"))
			throw Object.assign(new Error(response.headers.get("X-akismet-debug-help") ?? ""), {name: "AkismetError"});

		return response;
	}
}

/**
 * Defines the options of a {@link Client} instance.
 * @typedef {object} ClientOptions
 * @property {string} [baseUrl] The base URL of the remote API endpoint.
 * @property {boolean} [isTest] Value indicating whether the client operates in test mode.
 * @property {string} [userAgent] The user agent string to use when making requests.
 */
