import {Blog} from './blog';
import * as pkg from '../package.json';
import superagent from 'superagent';
import url from 'url';

/**
 * Submits comments to the [Akismet](https://akismet.com) service.
 */
export class Client {

  /**
   * The HTTP header containing the Akismet error messages.
   * @type {string}
   */
  static get DEBUG_HEADER() {
    return 'x-akismet-debug-help';
  }

  /**
   * The URL of the default API end point.
   * @type {string}
   */
  static get DEFAULT_ENDPOINT() {
    return 'https://rest.akismet.com';
  }

  /**
   * Initializes a new instance of the class.
   * @param {string} [apiKey] The Akismet API key.
   * @param {Blog|string} [blog] The front page or home URL of the instance making requests.
   */
  constructor(apiKey = '', blog = null) {

    /**
     * The Akismet API key.
     * @type {string}
     */
    this.apiKey = apiKey;

    /**
     * The front page or home URL of the instance making requests.
     * @type {Blog}
     */
    this.blog = typeof blog == 'string' ? new Blog(blog) : blog;

    /**
     * The URL of the API end point.
     * @type {string}
     */
    this.endPoint = Client.DEFAULT_ENDPOINT;

    /**
     * Value indicating whether the client operates in test mode.
     * You can use it when submitting test queries to Akismet.
     * @type {boolean}
     */
    this.isTest = false;

    /**
     * The user agent string to use when making requests.
     * If possible, the user agent string should always have the following format: `Application Name/Version | Plugin Name/Version`.
     * @type {string}
     */
    this.userAgent = `Node.js/${process.version.substr(1)} | Akismet/${pkg.version}`;
  }

  /**
   * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
   * @param {Comment} comment The comment to be checked.
   * @return {Promise<boolean>} A boolean value indicating whether it is spam.
   */
  async checkComment(comment) {
    let serviceURL = url.parse(this.endPoint);
    let endPoint = `${serviceURL.protocol}//${this.apiKey}.${serviceURL.host}/1.1/comment-check`;
    return await this._fetch(endPoint, comment.toJSON()) == 'true';
  }

  /**
   * Submits the specified comment that was incorrectly marked as spam but should not have been.
   * @param {Comment} comment The comment to be submitted.
   * @return {Promise} Completes once the comment has been submitted.
   */
  async submitHam(comment) {
    let serviceURL = url.parse(this.endPoint);
    let endPoint = `${serviceURL.protocol}//${this.apiKey}.${serviceURL.host}/1.1/submit-ham`;
    return this._fetch(endPoint, comment.toJSON());
  }

  /**
   * Submits the specified comment that was not marked as spam but should have been.
   * @param {Comment} comment The comment to be submitted.
   * @return {Promise} Completes once the comment has been submitted.
   */
  async submitSpam(comment) {
    let serviceURL = url.parse(this.endPoint);
    let endPoint = `${serviceURL.protocol}//${this.apiKey}.${serviceURL.host}/1.1/submit-spam`;
    return this._fetch(endPoint, comment.toJSON());
  }

  /**
   * Checks the API key against the service database, and returns a value indicating whether it is valid.
   * @return {Promise<boolean>} A boolean value indicating whether it is a valid API key.
   */
  async verifyKey() {
    let endPoint = `${this.endPoint}/1.1/verify-key`;
    return await this._fetch(endPoint, {key: this.apiKey}) == 'valid';
  }

  /**
   * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
   * @param {string} endPoint The URL of the end point to query.
   * @param {object} fields The fields describing the query body.
   * @return {Promise<string>} The response as string.
   * @emits {superagent.Request} The "request" event.
   * @emits {superagent.Response} The "response" event.
   */
  async _fetch(endPoint, fields) {
    if (!this.apiKey.length || !this.blog) throw new Error('The API key or the blog URL is empty.');

    let bodyFields = Object.assign(this.blog.toJSON(), fields);
    if (this.isTest) bodyFields.is_test = '1';

    let request = superagent.post(endPoint)
      .type('form')
      .set('User-Agent', this.userAgent)
      .send(bodyFields);

    this._onRequest.next(request);
    let response = await request;
    this._onResponse.next(response);

    if (Client.DEBUG_HEADER in response.header) throw new Error(response.header[Client.DEBUG_HEADER]);
    return response.text;
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    return {
      apiKey: this.apiKey,
      blog: this.blog ? this.blog.constructor.name : null,
      endPoint: this.endPoint,
      isTest: this.isTest,
      userAgent: this.userAgent
    };
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return `${this.constructor.name} ${JSON.stringify(this)}`;
  }
}
