import EventEmitter from 'events';
import fetch from 'node-fetch';
import {packageVersion} from '../version.g.js';
import {ClientError} from './error.js';
import {RequestEvent, ResponseEvent} from './event.js';

/**
 * Defines the options of a {@link NodeClient} instance.
 * @typedef {object} ClientOptions
 * @property {URL} [endPoint] The URL of the API end point.
 * @property {boolean} [isTest] Value indicating whether the client operates in test mode.
 * @property {string} [userAgent] The user agent string to use when making requests.
 */

/** Submits comments to the [Akismet](https://akismet.com) service. */
export class NodeClient extends EventEmitter {

  /**
   * An event that is triggered when a request is made to the remote service.
   * @type {string}
   */
  static get eventRequest() {
    return 'request';
  }

  /**
   * An event that is triggered when a response is received from the remote service.
   * @type {string}
   */
  static get eventResponse() {
    return 'response';
  }

  /**
   * Creates a new client.
   * @param {string} apiKey The Akismet API key.
   * @param {Blog} blog The front page or home URL of the instance making requests.
   * @param {ClientOptions} [options] An object specifying values used to initialize this instance.
   */
  constructor(apiKey, blog, options = {}) {
    super();

    const {
      endPoint = new URL('https://rest.akismet.com/1.1/'),
      isTest = false,
      userAgent = `Node.js/${process.version.substring(1)} | Akismet/${packageVersion}`
    } = options;

    /**
     * The Akismet API key.
     * @type {string}
     */
    this.apiKey = apiKey;

    /**
     * The front page or home URL of the instance making requests.
     * @type {Blog}
     */
    this.blog = blog;

    /**
     * The URL of the API end point.
     * @type {URL}
     */
    this.endPoint = endPoint;

    /**
     * Value indicating whether the client operates in test mode.
     * @type {boolean}
     */
    this.isTest = isTest;

    /**
     * The user agent string to use when making requests.
     * @type {string}
     */
    this.userAgent = userAgent;
  }

  /**
   * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
   * @param {Comment} comment The comment to be checked.
   * @return {Promise<boolean>} A boolean value indicating whether it is spam.
   */
  async checkComment(comment) {
    const endPoint = new URL(`${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}${this.endPoint.pathname}`);
    return await this._fetch(new URL('comment-check', endPoint), comment.toJSON()) == 'true';
  }

  /**
   * Submits the specified comment that was incorrectly marked as spam but should not have been.
   * @param {Comment} comment The comment to be submitted.
   * @return {Promise} Completes once the comment has been submitted.
   */
  async submitHam(comment) {
    const endPoint = new URL(`${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}${this.endPoint.pathname}`);
    return this._fetch(new URL('submit-ham', endPoint), comment.toJSON());
  }

  /**
   * Submits the specified comment that was not marked as spam but should have been.
   * @param {Comment} comment The comment to be submitted.
   * @return {Promise} Completes once the comment has been submitted.
   */
  async submitSpam(comment) {
    const endPoint = new URL(`${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}${this.endPoint.pathname}`);
    return this._fetch(new URL('submit-spam', endPoint), comment.toJSON());
  }

  /**
   * Checks the API key against the service database, and returns a value indicating whether it is valid.
   * @return {Promise<boolean>} A boolean value indicating whether it is a valid API key.
   */
  async verifyKey() {
    return await this._fetch(new URL('verify-key', this.endPoint), {key: this.apiKey}) == 'valid';
  }

  /**
   * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
   * @param {URL} endPoint The URL of the end point to query.
   * @param {object} fields The fields describing the query body.
   * @return {Promise<string>} The response as string.
   * @private
   */
  async _fetch(endPoint, fields) {
    const body = new URLSearchParams({...this.blog.toJSON(), ...fields});
    if (this.isTest) body.set('is_test', '1');

    const request = new fetch.Request(endPoint.href, {
      body,
      headers: {'content-type': 'application/x-www-form-urlencoded', 'user-agent': this.userAgent},
      method: 'POST'
    });

    this.emit(NodeClient.eventRequest, new RequestEvent(request));

    let response;
    try { response = await fetch(request); }
    catch (err) { throw new ClientError(err.message, endPoint); }

    this.emit(NodeClient.eventResponse, new ResponseEvent(response, request));

    if (!response.ok) throw new ClientError('An error occurred while querying the end point', endPoint);
    if (response.headers.has('x-akismet-debug-help')) throw new ClientError(response.headers.get('x-akismet-debug-help'), endPoint);
    return response.text();
  }
}
