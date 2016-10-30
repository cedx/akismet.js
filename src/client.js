import {Blog} from './blog';
import {EndPoints} from './end_points';
import * as pkg from '../package.json';
import {Observable} from 'rxjs';
import request from 'superagent';
import url from 'url';

/**
 * Provides the base class for clients that submit comments to [Akismet](https://akismet.com) service.
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
     * The URL of the remote service.
     * @type {string}
     */
    this.serviceURL = typeof options.serviceURL == 'string' ? options.serviceURL : `https://${Client.DEFAULT_SERVICE}`;

    /**
     * The user agent string to use when making requests.
     * If possible, the user agent string should always have the following format: `Application Name/Version | Plugin Name/Version`.
     * @type {string}
     */
    this.userAgent = typeof options.userAgent == 'string' ? options.userAgent : `Node.js/${process.version} | Akismet/${pkg.version}`;
  }

  /**
   * The host of the default remote service.
   * @type {string}
   */
  static get DEFAULT_SERVICE() {
    return 'rest.akismet.com';
  }

  /**
   * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
   * @param {Comment} comment The comment to be checked.
   * @return {Observable<boolean>} A boolean value indicating whether it is spam.
   */
  checkComment(comment) {
    let serviceURL = url.parse(this.serviceURL);

    let endPoint =
      serviceURL.host != Client.DEFAULT_SERVICE ?
      url.resolve(this.serviceURL, EndPoints.CHECK_COMMENT) :
      `${serviceURL.protocol}//${this.apiKey}.${serviceURL.host}${EndPoints.CHECK_COMMENT}`;

    return this._queryService(endPoint, comment.toJSON()).map(res => res == 'true');
  }

  /**
   * Submits the specified comment that was incorrectly marked as spam but should not have been.
   * @param {Comment} comment The comment to be submitted.
   * @return {Observable} Completes once the comment has been submitted.
   */
  submitHam(comment) {
    let serviceURL = url.parse(this.serviceURL);

    let endPoint =
      serviceURL.host != Client.DEFAULT_SERVICE ?
      url.resolve(this.serviceURL, EndPoints.SUBMIT_HAM) :
      `${serviceURL.protocol}//${this.apiKey}.${serviceURL.host}${EndPoints.SUBMIT_HAM}`;

    return this._queryService(endPoint, comment.toJSON());
  }

  /**
   * Submits the specified comment that was not marked as spam but should have been.
   * @param {Comment} comment The comment to be submitted.
   * @return {Observable} Completes once the comment has been submitted.
   */
  submitSpam(comment) {
    let serviceURL = url.parse(this.serviceURL);

    let endPoint =
      serviceURL.host != Client.DEFAULT_SERVICE ?
      url.resolve(this.serviceURL, EndPoints.SUBMIT_SPAM) :
      `${serviceURL.protocol}//${this.apiKey}.${serviceURL.host}${EndPoints.SUBMIT_SPAM}`;

    return this._queryService(endPoint, comment.toJSON());
  }

  /**
   * Checks the API key against the service database, and returns a value indicating whether it is valid.
   * @return {Observable<boolean>} A boolean value indicating whether it is a valid API key.
   */
  verifyKey() {
    let endPoint = url.resolve(this.serviceURL, EndPoints.VERIFY_KEY);
    return this._queryService(endPoint, {}).map(res => res == 'valid');
  }

  /**
   * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
   * @param {string} endPoint The URL of the end point to query.
   * @param {object} fields The fields describing the query body.
   * @return {Observable<string>} The response as string.
   */
  _queryService(endPoint, fields) {
    fields.key = this.apiKey;
    fields.blog = this.blog.url;
    if (this.blog.charset.length) fields.blog_charset = this.blog.charset;
    if (this.blog.language.length) fields.blog_lang = this.blog.language;
    if (this.isTest) fields.is_test = 'true';

    return new Observable(observer => request.post(endPoint)
      .type('form')
      .send(fields)
      .set('User-Agent', this.userAgent)
      .end((err, res) => {
        if (err || !res.ok) observer.error(new Error(err ? err.status : res.status));
        else {
          let akismetHeader = 'x-akismet-debug-help';
          if (akismetHeader in res.header) observer.error(new Error(res.header[akismetHeader]));
          else {
            observer.next(res.text);
            observer.complete();
          }
        }
      })
    );
  }
}
