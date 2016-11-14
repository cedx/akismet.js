import {Blog} from './blog';
import * as pkg from '../package.json';
import {Observable} from 'rxjs';
import superagent from 'superagent';
import url from 'url';

/**
 * Submits comments to the [Akismet](https://akismet.com) service.
 */
export class Client {

  /**
   * Initializes a new instance of the class.
   * @param {object} [options] An object specifying values used to initialize this instance.
   */
  constructor(options = {}) {

    /**
     * The Akismet API key.
     * @type {string}
     */
    this.apiKey = typeof options.apiKey == 'string' ? options.apiKey : '';

    /**
     * The front page or home URL of the instance making requests.
     * @type {Blog}
     */
    this.blog = options.blog instanceof Blog ? options.blog : new Blog({url: options.blog});

    /**
     * Value indicating whether the client operates in test mode.
     * You can use it when submitting test queries to Akismet.
     * @type {boolean}
     */
    this.test = typeof options.test == 'boolean' ? options.test : false;

    /**
     * The user agent string to use when making requests.
     * If possible, the user agent string should always have the following format: `Application Name/Version | Plugin Name/Version`.
     * @type {string}
     */
    this.userAgent = typeof options.userAgent == 'string' ? options.userAgent : `Node.js/${process.version} | Akismet/${pkg.version}`;
  }

  /**
   * The HTTP header containing the Akismet error messages.
   * @type {string}
   */
  static get DEBUG_HEADER() {
    return 'x-akismet-debug-help';
  }

  /**
   * The URL of the remote service.
   * @type {string}
   */
  static get SERVICE_URL() {
    return 'https://rest.akismet.com';
  }

  /**
   * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
   * @param {Comment} comment The comment to be checked.
   * @return {Observable<boolean>} A boolean value indicating whether it is spam.
   */
  checkComment(comment) {
    let serviceURL = url.parse(Client.SERVICE_URL);
    let endPoint = `${serviceURL.protocol}//${this.apiKey}.${serviceURL.host}/1.1/comment-check`;
    return this._fetch(endPoint, comment.toJSON()).map(res => res == 'true');
  }

  /**
   * Submits the specified comment that was incorrectly marked as spam but should not have been.
   * @param {Comment} comment The comment to be submitted.
   * @return {Observable} Completes once the comment has been submitted.
   */
  submitHam(comment) {
    let serviceURL = url.parse(Client.SERVICE_URL);
    let endPoint = `${serviceURL.protocol}//${this.apiKey}.${serviceURL.host}/1.1/submit-ham`;
    return this._fetch(endPoint, comment.toJSON());
  }

  /**
   * Submits the specified comment that was not marked as spam but should have been.
   * @param {Comment} comment The comment to be submitted.
   * @return {Observable} Completes once the comment has been submitted.
   */
  submitSpam(comment) {
    let serviceURL = url.parse(Client.SERVICE_URL);
    let endPoint = `${serviceURL.protocol}//${this.apiKey}.${serviceURL.host}/1.1/submit-spam`;
    return this._fetch(endPoint, comment.toJSON());
  }

  /**
   * Checks the API key against the service database, and returns a value indicating whether it is valid.
   * @return {Observable<boolean>} A boolean value indicating whether it is a valid API key.
   */
  verifyKey() {
    let endPoint = `${Client.SERVICE_URL}/1.1/verify-key`;
    return this._fetch(endPoint, {key: this.apiKey}).map(res => res == 'valid');
  }

  /**
   * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
   * @param {string} endPoint The URL of the end point to query.
   * @param {object} params The fields describing the query body.
   * @return {Observable<string>} The response as string.
   * @throws {Error} The API key or blog URL is empty.
   */
  _fetch(endPoint, params) {
    if (!this.apiKey.length || !this.blog) throw new Error('The API key or the blog URL is empty.');

    let bodyParams = Object.assign(this.blog.toJSON(), params);
    if (this.test) bodyParams.is_test = '1';

    return new Observable(observer => superagent.post(endPoint)
      .type('form')
      .set('User-Agent', this.userAgent)
      .send(bodyParams)
      .end((err, res) => {
        if (err || !res.ok) observer.error(new Error(err ? err.status : res.status));
        else if (Client.DEBUG_HEADER in res.header) observer.error(new Error(res.header[Client.DEBUG_HEADER]));
        else {
          observer.next(res.text);
          observer.complete();
        }
      })
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    return {
      apiKey: this.apiKey,
      blog: this.blog ? this.blog.constructor.name : null,
      test: this.test,
      userAgent: this.userAgent
    };
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    let json = JSON.stringify(this.toJSON(), null, 2);
    return `${this.constructor.name} ${json}`;
  }
}
