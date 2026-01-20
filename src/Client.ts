import type {Blog} from "./Blog.js";
import {CheckResult} from "./CheckResult.js";
import type {Comment} from "./Comment.js";
import pkg from "../package.json" with {type: "json"};

/**
 * Submits comments to the [Akismet](https://akismet.com) service.
 */
export class Client {

	/**
	 * The response returned by the `submit-ham` and `submit-spam` endpoints when the outcome is a success.
	 */
	static readonly #success = "Thanks for making the web a better place.";

	/**
	 * The Akismet API key.
	 */
	apiKey: string;

	/**
	 * The base URL of the remote API endpoint.
	 */
	baseUrl: URL;

	/**
	 * The front page or home URL of the instance making requests.
	 */
	blog: Blog;

	/**
	 * Value indicating whether the client operates in test mode.
	 */
	isTest: boolean;

	/**
	 * The user agent string to use when making requests.
	 */
	userAgent: string;

	/**
	 * Creates a new client.
	 * @param apiKey The Akismet API key.
	 * @param blog The front page or home URL of the instance making requests.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(apiKey: string, blog: Blog, options: ClientOptions = {}) {
		const {baseUrl = "https://rest.akismet.com"} = options;
		const url = baseUrl instanceof URL ? baseUrl.href : baseUrl;

		this.apiKey = apiKey;
		this.baseUrl = new URL(url.endsWith("/") ? url : `${url}/`);
		this.blog = blog;
		this.isTest = options.isTest ?? false;
		this.userAgent = options.userAgent ?? `${navigator.userAgent} | Akismet/${pkg.version}`;
	}

	/**
	 * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
	 * @param comment The comment to be checked.
	 * @returns A value indicating whether the specified comment is spam.
	 */
	async checkComment(comment: Comment): Promise<CheckResult> {
		const response = await this.#fetch("1.1/comment-check", comment.toJSON());
		if (await response.text() == "false") return CheckResult.Ham;
		return response.headers.get("X-akismet-pro-tip") == "discard" ? CheckResult.PervasiveSpam : CheckResult.Spam;
	}

	/**
	 * Submits the specified comment that was incorrectly marked as spam but should not have been.
	 * @param comment The comment to be submitted.
	 * @returns Resolves once the comment has been submitted.
	 */
	async submitHam(comment: Comment): Promise<void> {
		const response = await this.#fetch("1.1/submit-ham", comment.toJSON());
		if (await response.text() != Client.#success) throw new Error("Invalid server response.");
	}

	/**
	 * Submits the specified comment that was not marked as spam but should have been.
	 * @param comment The comment to be submitted.
	 * @returns Resolves once the comment has been submitted.
	 */
	async submitSpam(comment: Comment): Promise<void> {
		const response = await this.#fetch("1.1/submit-spam", comment.toJSON());
		if (await response.text() != Client.#success) throw new Error("Invalid server response.");
	}

	/**
	 * Checks the API key against the service database, and returns a value indicating whether it is valid.
	 * @returns `true` if the specified API key is valid, otherwise `false`.
	 */
	async verifyKey(): Promise<boolean> {
		try {
			const response = await this.#fetch("1.1/verify-key");
			return await response.text() == "valid";
		}
		catch {
			return false;
		}
	}

	/**
	 * Queries the service by posting the specified fields to a given end point, and returns the response.
	 * @param endPoint The URL of the end point to query.
	 * @param fields The fields describing the query body.
	 * @returns The server response.
	 */
	async #fetch(endPoint: string, fields: Record<string, any> = {}): Promise<Response> {
		const body = new URLSearchParams({...this.blog.toJSON(), api_key: this.apiKey});
		if (this.isTest) body.set("is_test", "1");

		for (const [key, value] of Object.entries(fields))
			if (!Array.isArray(value)) body.set(key, String(value));
			else {
				let index = 0;
				for (const item of value) body.set(`${key}[${index++}]`, String(item));
			}

		const response = await fetch(new URL(endPoint, this.baseUrl), {method: "POST", headers: {"User-Agent": this.userAgent}, body});
		if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

		const {headers} = response;
		if (headers.has("X-akismet-alert-msg")) throw new Error(headers.get("X-akismet-alert-msg")!);
		if (headers.has("X-akismet-debug-help")) throw new Error(headers.get("X-akismet-debug-help")!);
		return response;
	}
}

/**
 * Defines the options of a {@link Client} instance.
 */
export type ClientOptions = Partial<{

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
}>;
