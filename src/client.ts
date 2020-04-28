import {EventEmitter} from 'events';
import fetch, {Response} from 'node-fetch';
import {Blog} from './blog.js';
import {Comment} from './comment.js';
import {JsonObject} from './json.js';
import {packageVersion} from './version.g.js';

/** Specifies the result of a comment check. */
export enum CheckResult {

  /** The comment is not a spam (i.e. a ham). */
  isHam,

  /** The comment is a spam. */
  isSpam,

  /** The comment is a pervasive spam (i.e. it can be safely discarded). */
  isPervasiveSpam
}

/** An exception caused by an error in a [[Client]] request. */
export class ClientError extends Error {

  /**
   * Creates a new client error.
   * @param message A message describing the error.
   * @param uri The URL of the HTTP request or response that failed.
   */
  constructor(message: string = '', readonly uri?: URL) {
    super(message);
    this.name = 'ClientError';
  }
}

/** Submits comments to the [Akismet](https://akismet.com) service. */
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
  constructor(readonly apiKey: string, public blog: Blog, options: Partial<ClientOptions> = {}) {
    super();

    const {
      endPoint = new URL('https://rest.akismet.com/1.1/'),
      isTest = false,
      userAgent = `Node.js/${process.version.slice(1)} | Akismet/${packageVersion}`
    } = options;

    this.endPoint = endPoint;
    this.isTest = isTest;
    this.userAgent = userAgent;
  }

  /**
   * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
   * @param comment The comment to be checked.
   * @return A [[CheckResult]] value indicating whether the specified comment is spam.
   */
  async checkComment(comment: Comment): Promise<CheckResult> {
    const endPoint = new URL(`${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}${this.endPoint.pathname}`);
    const response = await this._fetch(new URL('comment-check', endPoint), comment.toJSON());
    if (await response.text() == 'false') return CheckResult.isHam;
    return response.headers.get('X-akismet-pro-tip') == 'discard' ? CheckResult.isPervasiveSpam : CheckResult.isSpam;
  }

  /**
   * Submits the specified comment that was incorrectly marked as spam but should not have been.
   * @param comment The comment to be submitted.
   * @return Completes once the comment has been submitted.
   */
  async submitHam(comment: Comment): Promise<void> {
    const endPoint = new URL(`${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}${this.endPoint.pathname}`);
    await this._fetch(new URL('submit-ham', endPoint), comment.toJSON());
  }

  /**
   * Submits the specified comment that was not marked as spam but should have been.
   * @param comment The comment to be submitted.
   * @return Completes once the comment has been submitted.
   */
  async submitSpam(comment: Comment): Promise<void> {
    const endPoint = new URL(`${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}${this.endPoint.pathname}`);
    await this._fetch(new URL('submit-spam', endPoint), comment.toJSON());
  }

  /**
   * Checks the API key against the service database, and returns a value indicating whether it is valid.
   * @return A boolean value indicating whether it is a valid API key.
   */
  async verifyKey(): Promise<boolean> {
    const response = await this._fetch(new URL('verify-key', this.endPoint), {key: this.apiKey});
    return await response.text() == 'valid';
  }

  /**
   * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
   * @param endPoint The URL of the end point to query.
   * @param fields The fields describing the query body.
   * @return The server response.
   */
  private async _fetch(endPoint: URL, fields: JsonObject): Promise<Response> {
    const body = new URLSearchParams({...this.blog.toJSON(), ...fields} as Record<string, string>);
    if (this.isTest) body.set('is_test', '1');

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore: `fetch` has wrong typings.
    const request = new fetch.Request(endPoint.href, {
      body,
      headers: {'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': this.userAgent},
      method: 'POST'
    });

    this.emit(Client.eventRequest, request);

    let response;
    try { response = await fetch(request); }
    catch (err) { throw new ClientError(err.message, endPoint); }

    this.emit(Client.eventResponse, response, request);

    if (!response.ok) throw new ClientError(await response.text(), endPoint);
    if (response.headers.has('X-akismet-debug-help')) throw new ClientError(response.headers.get('X-akismet-debug-help')!, endPoint);
    return response;
  }
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
