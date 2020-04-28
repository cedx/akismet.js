/// <reference types="node" />
import { EventEmitter } from 'events';
import { Blog } from './blog.js';
import { Comment } from './comment.js';
/** Specifies the result of a comment check. */
export declare enum CheckResult {
    /** The comment is not a spam (i.e. a ham). */
    isHam = 0,
    /** The comment is a spam. */
    isSpam = 1,
    /** The comment is a pervasive spam (i.e. it can be safely discarded). */
    isPervasiveSpam = 2
}
/** An exception caused by an error in a [[Client]] request. */
export declare class ClientError extends Error {
    readonly uri?: URL | undefined;
    /**
     * Creates a new client error.
     * @param message A message describing the error.
     * @param uri The URL of the HTTP request or response that failed.
     */
    constructor(message?: string, uri?: URL | undefined);
}
/** Submits comments to the [Akismet](https://akismet.com) service. */
export declare class Client extends EventEmitter {
    readonly apiKey: string;
    blog: Blog;
    /**
     * An event that is triggered when a request is made to the remote service.
     * @event request
     */
    static readonly eventRequest: string;
    /**
     * An event that is triggered when a response is received from the remote service.
     * @event response
     */
    static readonly eventResponse: string;
    /** The URL of the API end point. */
    endPoint: URL;
    /** Value indicating whether the client operates in test mode. */
    isTest: boolean;
    /** The user agent string to use when making requests. */
    userAgent: string;
    /**
     * Creates a new client.
     * @param apiKey The Akismet API key.
     * @param blog The front page or home URL of the instance making requests.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(apiKey: string, blog: Blog, options?: Partial<ClientOptions>);
    /**
     * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
     * @param comment The comment to be checked.
     * @return A [[CheckResult]] value indicating whether the specified comment is spam.
     */
    checkComment(comment: Comment): Promise<CheckResult>;
    /**
     * Submits the specified comment that was incorrectly marked as spam but should not have been.
     * @param comment The comment to be submitted.
     * @return Completes once the comment has been submitted.
     */
    submitHam(comment: Comment): Promise<void>;
    /**
     * Submits the specified comment that was not marked as spam but should have been.
     * @param comment The comment to be submitted.
     * @return Completes once the comment has been submitted.
     */
    submitSpam(comment: Comment): Promise<void>;
    /**
     * Checks the API key against the service database, and returns a value indicating whether it is valid.
     * @return A boolean value indicating whether it is a valid API key.
     */
    verifyKey(): Promise<boolean>;
    /**
     * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
     * @param endPoint The URL of the end point to query.
     * @param fields The fields describing the query body.
     * @return The server response.
     */
    private _fetch;
}
/** Defines the options of a [[Client]] instance. */
export interface ClientOptions {
    /** The URL of the API end point. */
    endPoint: URL;
    /** Value indicating whether the client operates in test mode. */
    isTest: boolean;
    /** The user agent string to use when making requests. */
    userAgent: string;
}
