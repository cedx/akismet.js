import {Blog} from "./blog.js";
import {CheckResult} from "./check_result.js";
import {Comment} from "./comment.js";

/**
 * Submits comments to the [Akismet](https://akismet.com) service.
 */
export class Client {

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
	constructor(apiKey: string, blog: Blog, options?: ClientOptions);

	/**
	 * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
	 * @param comment The comment to be checked.
	 * @returns A value indicating whether the specified comment is spam.
	 */
	checkComment(comment: Comment): Promise<CheckResult>;

	/**
	 * Submits the specified comment that was incorrectly marked as spam but should not have been.
	 * @param comment The comment to be submitted.
	 * @returns Resolves once the comment has been submitted.
	 */
	submitHam(comment: Comment): Promise<void>;

	/**
	 * Submits the specified comment that was not marked as spam but should have been.
	 * @param comment The comment to be submitted.
	 * @returns Resolves once the comment has been submitted.
	 */
	submitSpam(comment: Comment): Promise<void>;

	/**
	 * Checks the API key against the service database, and returns a value indicating whether it is valid.
	 * @returns `true` if the specified API key is valid, otherwise `false`.
	 */
	verifyKey(): Promise<boolean>;
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
