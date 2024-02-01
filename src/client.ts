import {version} from "node:process";
import type {Blog} from "./blog.js";
import {CheckResult} from "./check_result.js";
import type {Comment} from "./comment.js";

/**
 * Submits comments to the [Akismet](https://akismet.com) service.
 */
export class Client {

	/**
	 * The response returned by the `submit-ham` and `submit-spam` endpoints when the outcome is a success.
	 */
	static readonly #success = "Thanks for making the web a better place.";

	/**
	 * The package version.
	 */
	static readonly #version = "16.1.0";

	/**
	 * The Akismet API key.
	 */
	readonly apiKey: string;

	/**
	 * The base URL of the remote API endpoint.
	 */
	readonly baseUrl: URL;

	/**
	 * The front page or home URL of the instance making requests.
	 */
	readonly blog: Blog;

	/**
	 * Value indicating whether the client operates in test mode.
	 */
	readonly isTest: boolean;

	/**
	 * The user agent string to use when making requests.
	 */
	readonly userAgent: string;

	/**
	 * Creates a new client.
	 * @param apiKey The Akismet API key.
	 * @param blog The front page or home URL of the instance making requests.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(apiKey: string, blog: Blog, options: Partial<ClientOptions> = {}) {
		const {baseUrl = "https://rest.akismet.com"} = options;
		const url = baseUrl instanceof URL ? baseUrl.href : baseUrl;

		this.apiKey = apiKey;
		this.baseUrl = new URL(url.endsWith("/") ? url : `${url}/`);
		this.blog = blog;
		this.isTest = options.isTest ?? false;
		this.userAgent = options.userAgent ?? `Node.js/${version.slice(1)} | Akismet/${Client.#version}`;
	}

	/**
	 * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
	 * @param comment The comment to be checked.
	 * @returns A value indicating whether the specified comment is spam.
	 */
	async checkComment(comment: Comment): Promise<CheckResult> {
		const response = await this.#fetch("1.1/comment-check", comment.toJSON());
		return await response.text() == "false"
			? CheckResult.ham
			: response.headers.get("x-akismet-pro-tip") == "discard" ? CheckResult.pervasiveSpam : CheckResult.spam;
	}

	/**
	 * Submits the specified comment that was incorrectly marked as spam but should not have been.
	 * @param comment The comment to be submitted.
	 * @returns Resolves once the comment has been submitted.
	 */
	async submitHam(comment: Comment): Promise<void> {
		const response = await this.#fetch("1.1/submit-ham", comment.toJSON());
		if (await response.text() != Client.#success) throw Error("Invalid server response.");
	}

	/**
	 * Submits the specified comment that was not marked as spam but should have been.
	 * @param comment The comment to be submitted.
	 * @returns Resolves once the comment has been submitted.
	 */
	async submitSpam(comment: Comment): Promise<void> {
		const response = await this.#fetch("1.1/submit-spam", comment.toJSON());
		if (await response.text() != Client.#success) throw Error("Invalid server response.");
	}

	/**
	 * Checks the API key against the service database, and returns a value indicating whether it is valid.
	 * @returns `true` if the specified API key is valid, otherwise `false`.
	 */
	async verifyKey(): Promise<boolean> {
		const response = await this.#fetch("1.1/verify-key", {key: this.apiKey});
		return await response.text() == "valid";
	}

	/**
	 * Queries the service by posting the specified fields to a given end point, and returns the response.
	 * @param endpoint The URL of the end point to query.
	 * @param fields The fields describing the query body.
	 * @returns The server response.
	 */
	async #fetch(endpoint: string, fields: Record<string, string[]|string>): Promise<Response> {
		const body = new URLSearchParams(this.blog.toJSON());
		body.set("api_key", this.apiKey);
		if (this.isTest) body.set("is_test", "1");

		for (const [key, value] of Object.entries(fields))
			if (!Array.isArray(value)) body.set(key, value);
			else {
				let index = 0;
				for (const item of value) body.set(`${key}[${index++}]`, item);
			}

		const response = await fetch(new URL(endpoint, this.baseUrl), {method: "POST", headers: {"user-agent": this.userAgent}, body});
		if (!response.ok) throw Error(`${response.status} ${response.statusText}`);

		if (response.headers.has("x-akismet-alert-code")) {
			const code = response.headers.get("x-akismet-alert-code") ?? "";
			throw Object.assign(Error(response.headers.get("x-akismet-alert-msg") ?? ""), {name: code ? `AkismetError #${code}` : "AkismetError"});
		}

		if (response.headers.has("x-akismet-debug-help"))
			throw Object.assign(Error(response.headers.get("x-akismet-debug-help") ?? ""), {name: "AkismetError"});

		return response;
	}
}

/**
 * Defines the options of a {@link Client} instance.
 */
export interface ClientOptions {

	/**
	 * The base URL of the remote API endpoint.
	 */
	baseUrl: URL|string;

	/**
	 * Value indicating whether the client operates in test mode.
	 */
	isTest: boolean;

	/**
	 * The user agent string to use when making requests.
	 */
	userAgent: string;
}
