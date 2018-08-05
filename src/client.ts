const EventEmitter = require('events');
const fetch = require('node-fetch');
const {Blog} = require('./blog.js');
const pkg = require('../package.json');

/**
 * An exception caused by an error in a `Client` request.
 */
class ClientError extends Error {

  /**
   * Creates a new client error.
   * @param {string} message A message describing the error.
   * @param {string|URL} [uri] The URL of the HTTP request or response that failed.
   */
  constructor(message, uri) {
    super(message);

    /**
     * The error name.
     * @type {string}
     */
    this.name = 'ClientError';

    /**
     * The URL of the HTTP request or response that failed.
     * @type {URL}
     */
    this.uri = typeof uri == 'string' ? new URL(uri) : uri;
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    let values = `"${this.message}"`;
    if (this.uri) values = `${values}, uri: "${this.uri.href}"`;
    return `${this.name}(${values})`;
  }
}

/**
 * Submits comments to the [Akismet](https://akismet.com) service.
 */
class Client extends EventEmitter {

  /**
   * Creates a new client.
   * @param {string} apiKey The Akismet API key.
   * @param {Blog|string} blog The front page or home URL of the instance making requests.
   * @param {Object} [options] An object specifying values used to initialize this instance.
   */
  constructor(apiKey, blog, {endPoint = 'https://rest.akismet.com', isTest = false, userAgent = ''} = {}) {
    super();

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
     * @type {URL}
     */
    this.endPoint = typeof endPoint == 'string' ? new URL(endPoint) : endPoint;

    /**
     * Value indicating whether the client operates in test mode.
     * You can use it when submitting test queries to Akismet.
     * @type {boolean}
     */
    this.isTest = isTest;

    /**
     * The user agent string to use when making requests.
     * If possible, the user agent string should always have the following format: `Application Name/Version | Plugin Name/Version`.
     * @type {string}
     */
    this.userAgent = userAgent.length ? userAgent : `Node.js/${process.version.substr(1)} | Akismet/${pkg.version}`;
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'Client';
  }

  /**
   * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
   * @param {Comment} comment The comment to be checked.
   * @return {Promise<boolean>} A boolean value indicating whether it is spam.
   */
  async checkComment(comment) {
    let endPoint = new URL('/1.1/comment-check', `${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}`);
    return await this._fetch(endPoint, comment.toJSON()) == 'true';
  }

  /**
   * Submits the specified comment that was incorrectly marked as spam but should not have been.
   * @param {Comment} comment The comment to be submitted.
   * @return {Promise} Completes once the comment has been submitted.
   */
  async submitHam(comment) {
    let endPoint = new URL('/1.1/submit-ham', `${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}`);
    return this._fetch(endPoint, comment.toJSON());
  }

  /**
   * Submits the specified comment that was not marked as spam but should have been.
   * @param {Comment} comment The comment to be submitted.
   * @return {Promise} Completes once the comment has been submitted.
   */
  async submitSpam(comment) {
    let endPoint = new URL('/1.1/submit-spam', `${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}`);
    return this._fetch(endPoint, comment.toJSON());
  }

  /**
   * Checks the API key against the service database, and returns a value indicating whether it is valid.
   * @return {Promise<boolean>} A boolean value indicating whether it is a valid API key.
   */
  async verifyKey() {
    let endPoint = new URL('/1.1/verify-key', this.endPoint);
    return await this._fetch(endPoint, {key: this.apiKey}) == 'valid';
  }

  /**
   * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
   * @param {URL} endPoint The URL of the end point to query.
   * @param {Object} fields The fields describing the query body.
   * @return {Promise<string>} The response as string.
   * @emits {Request} The "request" event.
   * @emits {Response} The "response" event.
   */
  async _fetch(endPoint, fields) {
    let body = new URLSearchParams(Object.assign(this.blog.toJSON(), fields));
    if (this.isTest) body.set('is_test', '1');

    let req = new fetch.Request(endPoint.href, {
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded', 'user-agent': this.userAgent},
      body
    });

    this.emit('request', req);

    let res;
    try { res = await fetch(req); }
    catch (err) { throw new ClientError(err.message, endPoint); }

    this.emit('response', req, res);

    if (!res.ok) throw new ClientError('An error occurred while querying the end point', endPoint);
    if (res.headers.has('x-akismet-debug-help')) throw new ClientError(res.headers.get('x-akismet-debug-help'), endPoint);
    return res.text();
  }
}

// Module exports.
exports.Client = Client;
exports.ClientError = ClientError;
