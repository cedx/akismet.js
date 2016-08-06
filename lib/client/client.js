/**
 * Implementation of the `akismet.Client` class.
 * @module client/client
 */
const {Blog, EndPoints, HTTPHeaders} = require('../core');
const pkg = require('../../package.json');
const request = require('superagent');
const url = require('url');

/**
 * Provides the base class for clients that submit comments to [Akismet](https://akismet.com) service.
 */
class Client {

  /**
   * Initializes a new instance of the class.
   * @param {string} apiKey The Akismet API key used to query the service.
   * @param {(string|Blog)} blog The front page or home URL transmitted when making requests.
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
    this.blog = blog instanceof Blog ? blog : new Blog(blog);

    /**
     * Value indicating whether the client operates in test mode.
     * You can use it when submitting test queries to Akismet.
     * @type {boolean}
     */
    this.isTest = false;

    /**
     * The URL of the remote service.
     * @type {string}
     */
    this.serviceUrl = `https://${Client.DEFAULT_SERVICE}`;

    /**
     * The user agent string to use when making requests.
     * If possible, the user agent string should always have the following format: `Application Name/Version | Plugin Name/Version`.
     * @type {string}
     */
    this.userAgent = `Node.js/${typeof global.window == 'undefined' ? process.version : '0.0.0'} | Akismet/${pkg.version}`;

    // Initialize the instance.
    for(let key in options) {
      let option = options[key];
      if(this.hasOwnProperty(key) && typeof option != 'undefined') this[key] = option;
    }
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
   * @returns {Promise} A boolean value indicating whether it is spam.
   */
  checkComment(comment) {
    let serviceUrl = url.parse(this.serviceUrl);

    let endPoint =
      serviceUrl.host != Client.DEFAULT_SERVICE ?
      url.resolve(this.serviceUrl, EndPoints.CHECK_COMMENT) :
      `${serviceUrl.protocol}//${this.apiKey}.${serviceUrl.host}${EndPoints.CHECK_COMMENT}`;

    return this._queryService(endPoint, comment.toJSON()).then(res => res == 'true');
  }

  /**
   * Submits the specified comment that was incorrectly marked as spam but should not have been.
   * @param {Comment} comment The comment to be submitted.
   * @returns {Promise} Completes once the comment has been submitted.
   */
  submitHam(comment) {
    let serviceUrl = url.parse(this.serviceUrl);

    let endPoint =
      serviceUrl.host != Client.DEFAULT_SERVICE ?
      url.resolve(this.serviceUrl, EndPoints.SUBMIT_HAM) :
      `${serviceUrl.protocol}//${this.apiKey}.${serviceUrl.host}${EndPoints.SUBMIT_HAM}`;

    return this._queryService(endPoint, comment.toJSON());
  }

  /**
   * Submits the specified comment that was not marked as spam but should have been.
   * @param {Comment} comment The comment to be submitted.
   * @returns {Promise} Completes once the comment has been submitted.
   */
  submitSpam(comment) {
    let serviceUrl = url.parse(this.serviceUrl);

    let endPoint =
      serviceUrl.host != Client.DEFAULT_SERVICE ?
      url.resolve(this.serviceUrl, EndPoints.SUBMIT_SPAM) :
      `${serviceUrl.protocol}//${this.apiKey}.${serviceUrl.host}${EndPoints.SUBMIT_SPAM}`;

    return this._queryService(endPoint, comment.toJSON());
  }

  /**
   * Returns a string representation of this object.
   * @returns {string} The string representation of this object.
   */
  toString() {
    let json = JSON.stringify(this.toJSON(), null, 2);
    return `${this.constructor.name} ${json}`;
  }

  /**
   * Checks the API key against the service database, and returns a value indicating whether it is valid.
   * @returns {Promise} A boolean value indicating whether it is a valid API key.
   */
  verifyKey() {
    let endPoint = url.resolve(this.serviceUrl, EndPoints.VERIFY_KEY);
    return this._queryService(endPoint, {}).then(res => res == 'valid');
  }

  /**
   * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
   * @param {string} endPoint The URL of the end point to query.
   * @param {object} fields The fields describing the query body.
   * @returns {Promise} The response as string.
   * @private
   */
  _queryService(endPoint, fields) {
    fields.key = this.apiKey;
    fields.blog = this.blog.url;
    if(this.blog.charset) fields.blog_charset = this.blog.charset;
    if(this.blog.lang) fields.blog_lang = this.blog.lang;
    if(this.isTest) fields.is_test = 'true';

    return new Promise((resolve, reject) => request.post(endPoint)
      .type('form')
      .send(fields)
      .set(typeof window != 'undefined' ? HTTPHeaders.X_USER_AGENT : 'user-agent', this.userAgent)
      .end((err, res) => {
        if(err || !res.ok)
          reject(new Error(err ? err.status : res.status));
        else {
          let akismetHeader = HTTPHeaders.X_AKISMET_DEBUG_HELP;
          if(akismetHeader in res.header) reject(new Error(res.header[akismetHeader]));
          else resolve(res.text);
        }
      })
    );
  }
}

// Public interface.
module.exports = Client;
