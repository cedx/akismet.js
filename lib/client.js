import {fetch} from "undici";

/**
 * Specifies the result of a comment check.
 * @enum {number}
 */
export const CheckResult = Object.freeze({

	/** The comment is not a spam (i.e. a ham). */
	ham: 0,

	/** The comment is a spam. */
	spam: 1,

	/** The comment is a pervasive spam (i.e. it can be safely discarded). */
	pervasiveSpam: 2
});

/** Submits comments to the [Akismet](https://akismet.com) service. */
let Client = /** @class */ (() => {
	class Client extends EventEmitter {
		/**
		 * Creates a new client.
		 * @param apiKey The Akismet API key.
		 * @param blog The front page or home URL of the instance making requests.
		 * @param options An object providing values to initialize this instance.
		 */
		constructor(apiKey, blog, options = {}) {
			super();
			this.apiKey = apiKey;
			this.blog = blog;
			const { endPoint = new URL("https://rest.akismet.com/1.1/"), isTest = false, userAgent = `Node.js/${process.version.slice(1)} | Akismet/${packageVersion}` } = options;
			this.endPoint = endPoint;
			this.isTest = isTest;
			this.userAgent = userAgent;
		}
		/**
		 * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
		 * @param comment The comment to be checked.
		 * @returns A [[CheckResult]] value indicating whether the specified comment is spam.
		 */
		async checkComment(comment) {
			const endPoint = new URL(`${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}${this.endPoint.pathname}`);
			const response = await this._fetch(new URL("comment-check", endPoint), comment.toJSON());
			if (await response.text() == "false")
				return CheckResult.isHam;
			return response.headers.get("X-akismet-pro-tip") == "discard" ? CheckResult.isPervasiveSpam : CheckResult.isSpam;
		}
		/**
		 * Submits the specified comment that was incorrectly marked as spam but should not have been.
		 * @param comment The comment to be submitted.
		 * @returns Completes once the comment has been submitted.
		 */
		async submitHam(comment) {
			const endPoint = new URL(`${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}${this.endPoint.pathname}`);
			await this._fetch(new URL("submit-ham", endPoint), comment.toJSON());
		}
		/**
		 * Submits the specified comment that was not marked as spam but should have been.
		 * @param comment The comment to be submitted.
		 * @returns Completes once the comment has been submitted.
		 */
		async submitSpam(comment) {
			const endPoint = new URL(`${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}${this.endPoint.pathname}`);
			await this._fetch(new URL("submit-spam", endPoint), comment.toJSON());
		}
		/**
		 * Checks the API key against the service database, and returns a value indicating whether it is valid.
		 * @returns A boolean value indicating whether it is a valid API key.
		 */
		async verifyKey() {
			const response = await this._fetch(new URL("verify-key", this.endPoint), { key: this.apiKey });
			return await response.text() == "valid";
		}
		/**
		 * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
		 * @param endPoint The URL of the end point to query.
		 * @param fields The fields describing the query body.
		 * @returns The server response.
		 */
		async _fetch(endPoint, fields) {
			const body = new URLSearchParams({ ...this.blog.toJSON(), ...fields });
			if (this.isTest)
				body.set("is_test", "1");
			// @ts-expect-error: `fetch` has wrong typings.
			const request = new fetch.Request(endPoint.href, {
				body,
				headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": this.userAgent },
				method: "POST"
			});
			this.emit(Client.eventRequest, request);
			let response;
			try {
				response = await fetch(request);
			}
			catch (err) {
				throw new ClientError(err.message, endPoint);
			}
			this.emit(Client.eventResponse, response, request);
			if (!response.ok)
				throw new ClientError(await response.text(), endPoint);
			if (response.headers.has("X-akismet-debug-help"))
				throw new ClientError(response.headers.get("X-akismet-debug-help"), endPoint);
			return response;
		}
	}
	/**
	 * An event that is triggered when a request is made to the remote service.
	 * @event request
	 */
	Client.eventRequest = "request";
	/**
	 * An event that is triggered when a response is received from the remote service.
	 * @event response
	 */
	Client.eventResponse = "response";
	return Client;
})();
export { Client };
