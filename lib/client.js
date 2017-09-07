'use strict';

const {default: fetch, Request} = require('node-fetch');
const {Observable, Subject} = require('rxjs');
const {URL, URLSearchParams} = require('url');

const {Blog} = require('./blog');
const {version: pkgVersion} = require('../package.json');

/**
 * Submits comments to the [Akismet](https://akismet.com) service.
 */
exports.Client = class Client {

  /**
   * The HTTP header containing the Akismet error messages.
   * @type {string}
   */
  static get DEBUG_HEADER() {
    return 'x-akismet-debug-help';
  }

  /**
   * The URL of the default API end point.
   * @type {URL}
   */
  static get DEFAULT_ENDPOINT() {
    return new URL('https://rest.akismet.com');
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
     * @type {URL}
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
    this.userAgent = `Node.js/${process.version.substr(1)} | Akismet/${pkgVersion}`;
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
   * @return {Observable<boolean>} A boolean value indicating whether it is spam.
   */
  checkComment(comment) {
    let endPoint = new URL('1.1/comment-check', `${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}`);
    return this._fetch(endPoint, comment.toJSON()).map(res => res == 'true');
  }

  /**
   * Submits the specified comment that was incorrectly marked as spam but should not have been.
   * @param {Comment} comment The comment to be submitted.
   * @return {Observable} Completes once the comment has been submitted.
   */
  submitHam(comment) {
    let endPoint = new URL('1.1/submit-ham', `${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}`);
    return this._fetch(endPoint, comment.toJSON());
  }

  /**
   * Submits the specified comment that was not marked as spam but should have been.
   * @param {Comment} comment The comment to be submitted.
   * @return {Observable} Completes once the comment has been submitted.
   */
  submitSpam(comment) {
    let endPoint = new URL('1.1/submit-spam', `${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}`);
    return this._fetch(endPoint, comment.toJSON());
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    return {
      apiKey: this.apiKey,
      blog: this.blog ? this.blog.constructor.name : null,
      endPoint: this.endPoint ? this.endPoint.href : null,
      isTest: this.isTest,
      userAgent: this.userAgent
    };
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }

  /**
   * Checks the API key against the service database, and returns a value indicating whether it is valid.
   * @return {Observable<boolean>} A boolean value indicating whether it is a valid API key.
   */
  verifyKey() {
    let endPoint = new URL('1.1/verify-key', this.endPoint);
    return this._fetch(endPoint, {key: this.apiKey}).map(res => res == 'valid');
  }

  /**
   * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
   * @param {URL} endPoint The URL of the end point to query.
   * @param {object} fields The fields describing the query body.
   * @return {Observable<string>} The response as string.
   * @emits {Request} The "request" event.
   * @emits {Response} The "response" event.
   */
  _fetch(endPoint, fields) {
    if (!this.apiKey.length || !this.blog) return Observable.throw(new Error('The API key or the blog URL is empty.'));

    let body = new URLSearchParams(Object.assign(this.blog.toJSON(), fields));
    if (this.isTest) body.set('is_test', '1');

    let req = new Request(endPoint.href, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': this.userAgent},
      body
    });

    this._onRequest.next(req);
    return Observable.from(fetch(req)).mergeMap(res => {
      this._onResponse.next(res);
      if (!res.ok) return Observable.throw(new Error(`${res.status} ${res.statusText}`));
      if (res.headers.has(Client.DEBUG_HEADER)) return Observable.throw(new Error(res.headers.get(Client.DEBUG_HEADER)));
      return Observable.from(res.text());
    });
  }
};
