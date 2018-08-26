import {EventEmitter} from 'events';
import fetch, {Request, Response} from 'node-fetch';

// @ts-ignore: disable processing of the imported JSON file.
import * as pkg from '../package.json';
import {Blog} from './blog';
import {JsonMap} from './map';

/**
 * Submits comments to the [Akismet](https://akismet.com) service.
 */
export class Client extends EventEmitter {

  /**
   * An event that is triggered when a request is made to the remote service.
   * @event request
   */
  static readonly eventRequest: string = 'request';

  /**
   * An event that is triggered when a response is received from the remote service.
   * @event response
   */
  static readonly eventResponse: string = 'response';

  /**
   * The URL of the API end point.
   */
  endPoint: URL;

  /**
   * Value indicating whether the client operates in test mode.
   * You can use it when submitting test queries to Akismet.
   */
  isTest: boolean;

  /**
   * The user agent string to use when making requests.
   * If possible, the user agent string should always have the following format: `Application Name/Version | Plugin Name/Version`.
   */
  userAgent: string;

  /**
   * Creates a new client.
   * @param apiKey The Akismet API key.
   * @param blog The front page or home URL of the instance making requests.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(public apiKey: string, public blog: Blog, options: Partial<ClientOptions> = {}) {
    super();

    const {
      endPoint = new URL('https://rest.akismet.com'),
      isTest = false,
      userAgent = `Node.js/${process.version.substr(1)} | Akismet/${pkg.version}`
    } = options;

    this.endPoint = endPoint;
    this.isTest = isTest;
    this.userAgent = userAgent;
  }

  /**
   * The class name.
   */
  get [Symbol.toStringTag](): string {
    return 'Client';
  }

  /**
   * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
   * @param comment The comment to be checked.
   * @return A boolean value indicating whether it is spam.
   */
  async checkComment(comment: Comment): Promise<boolean> {
    const endPoint = new URL('1.1/comment-check', `${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}`);
    return await this._fetch(endPoint, comment.toJSON()) == 'true';
  }

  /**
   * Submits the specified comment that was incorrectly marked as spam but should not have been.
   * @param comment The comment to be submitted.
   * @return Completes once the comment has been submitted.
   */
  async submitHam(comment: Comment): Promise<void> {
    const endPoint = new URL('1.1/submit-ham', `${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}`);
    return this._fetch(endPoint, comment.toJSON());
  }

  /**
   * Submits the specified comment that was not marked as spam but should have been.
   * @param comment The comment to be submitted.
   * @return Completes once the comment has been submitted.
   */
  async submitSpam(comment: Comment): Promise<void> {
    const endPoint = new URL('1.1/submit-spam', `${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}`);
    return this._fetch(endPoint, comment.toJSON());
  }

  /**
   * Checks the API key against the service database, and returns a value indicating whether it is valid.
   * @return A boolean value indicating whether it is a valid API key.
   */
  async verifyKey(): Promise<boolean> {
    const endPoint = new URL('1.1/verify-key', this.endPoint);
    return await this._fetch(endPoint, {key: this.apiKey}) == 'valid';
  }

  /**
   * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
   * @param {URL} endPoint The URL of the end point to query.
   * @param {Object} fields The fields describing the query body.
   * @return {Promise<string>} The response as string.
   * @event {Request} The "request" event.
   * @event {Response} The "response" event.
   */
  async _fetch(endPoint: URL, fields: JsonMap) {
    const body = new URLSearchParams(Object.assign(this.blog.toJSON(), fields));
    if (this.isTest) body.set('is_test', '1');

    const req = new Request(endPoint.href, {
      body,
      headers: {'content-type': 'application/x-www-form-urlencoded', 'user-agent': this.userAgent},
      method: 'POST'
    });

    this.emit(Client.eventRequest, req);

    let res: Response;
    try { res = await fetch(req); }
    catch (err) { throw new ClientError(err.message, endPoint); }

    this.emit(Client.eventResponse, req, res);

    if (!res.ok) throw new ClientError('An error occurred while querying the end point', endPoint);
    if (res.headers.has('x-akismet-debug-help')) throw new ClientError(res.headers.get('x-akismet-debug-help')!, endPoint);
    return res.text();
  }
}

/**
 * An exception caused by an error in a `Client` request.
 */
export class ClientError extends Error {

  /**
   * Creates a new client error.
   * @param message A message describing the error.
   * @param uri The URL of the HTTP request or response that failed.
   */
  constructor(message: string = '', readonly uri: URL | null = null) {
    super(message);
    this.name = 'ClientError';
  }

  /**
   * Returns a string representation of this object.
   * @return The string representation of this object.
   */
  toString(): string {
    let values = `"${this.message}"`;
    if (this.uri) values = `${values}, uri: "${this.uri.href}"`;
    return `${this.name}(${values})`;
  }
}

/**
 * Defines the options of a `Client` instance.
 */
export interface ClientOptions {

  /**
   * The URL of the API end point.
   */
  endPoint: URL;

  /**
   * Value indicating whether the client operates in test mode.
   */
  isTest: boolean;

  /**
   * The user agent string to use when making requests.
   */
  userAgent: string;
}
