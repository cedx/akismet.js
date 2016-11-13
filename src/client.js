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
   * @param {string} apiKey The Akismet API key used to query the service.
   * @param {string|Blog} blog The front page or home URL transmitted when making requests.
   * @param {object} [options] An object specifying additional values used to initialize this instance.
   */
  constructor(apiKey, blog, options = {}) {

    /**
     * The Akismet API key.
     * @type {string}
     */
    this.apiKey = apiKey;

    /**
     * The front page or home URL of the instance making requests.
     * @type {Blog}
     */
    this.blog = blog instanceof Blog ? blog : new Blog({url: blog});

    /**
     * Value indicating whether the client operates in test mode.
     * You can use it when submitting test queries to Akismet.
     * @type {boolean}
     */
    this.isTest = typeof options.isTest == 'boolean' ? options.isTest : false;

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
   */
  _fetch(endPoint, params) {
    params.blog = this.blog.url;
    if (this.blog.charset.length) params.blog_charset = this.blog.charset;
    if (this.blog.language.length) params.blog_lang = this.blog.language;
    if (this.isTest) params.is_test = 'true';

    return new Observable(observer => superagent.post(endPoint)
      .type('form')
      .send(params)
      .set('User-Agent', this.userAgent)
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
}
