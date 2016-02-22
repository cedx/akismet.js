/**
 * Contains classes that provide a simple programming interface for querying the [Akismet](https://akismet.com) service.
 * @module client
 */
'use strict';

// Module dependencies.
const enums = require('./enums');
const request = require('superagent');
const url = require('url');

/**
 * Represents the front page or home URL transmitted when making requests.
 */
class Blog {

  /**
   * Initializes a new instance of the class.
   * @param {string} url The blog or site URL.
   * @param {object} [options] An object specifying additional values used to initialize this instance.
   */
  constructor(url, options) {

    /**
     * The character encoding for the values included in comments.
     * @var {string}
     */
    this.charset = null;

    /**
     * The language(s) in use on the blog or site, in ISO 639-1 format, comma-separated.
     * @var {string}
     */
    this.language = null;

    /**
     * The blog or site URL.
     * @var {string}
     */
    this.url = (typeof url == 'string' ? url : null);

    // Initialize the instance.
    if(typeof options == 'object' && options) {
      for(let key in options) {
        let option = options[key];
        if(this.hasOwnProperty(key) && typeof option != 'undefined') this[key] = option;
      }
    }
  }

  /**
   * Creates a new author from the specified JSON string.
   * @param {object|string} json A JSON string, or an already parsed object, representing an author.
   * @return {Blog} The instance corresponding to the specified JSON object, or `null` if a parsing error occurred.
   */
  static fromJSON(json) {
    let map;
    if(typeof json != 'string') map = json;
    else {
      try { map = JSON.parse(json); }
      catch(e) { return null; }
    }

    return !map || typeof map != 'object' ? null : new Blog(map.blog, {
      charset: map.blog_charset,
      language: map.blog_lang
    });
  }

  /**
   * Converts this object to a string in JSON format.
   * @param {number|string} [space] Causes the resulting string to be pretty-printed.
   * @return {string} The JSON representation of this object.
   */
  toJSON(space) {
    let map = {};
    if(typeof this.url == 'string') map.blog = this.url;
    if(typeof this.charset == 'string') map.blog_charset = this.charset;
    if(typeof this.language == 'string') map.blog_lang = this.language;
    return JSON.stringify(map, null, space);
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return this.constructor.name+' '+this.toJSON(2);
  }
}

/**
 * Provides the base class for clients that submit comments to [Akismet](https://akismet.com) service.
 */
class Client {

  /**
   * Initializes a new instance of the class.
   * @param {string} apiKey The Akismet API key used to query the service.
   * @param {string|Blog} blog The front page or home URL transmitted when making requests.
   * @param {object} [options] An object specifying additional values used to initialize this instance.
   */
  constructor(apiKey, blog, options) {

    /**
     * The Akismet API key.
     * @var {string}
     */
    this.apiKey = String(apiKey);

    /**
     * The front page or home URL of the instance making requests.
     * @var {Blog}
     */
    this.blog = (blog instanceof Blog ? blog : new Blog(blog));

    /**
     * Value indicating whether the client operates in test mode.
     * You can use it when submitting test queries to Akismet.
     * @var {boolean}
     * @default
     */
    this.isTest = false;

    /**
     * The URL of the remote service.
     * @var {string}
     * @default
     */
    this.serviceUrl = `https://${Client.DEFAULT_SERVICE}`;

    /**
     * The user agent string to use when making requests.
     * If possible, the user agent string should always have the following format: `Application Name/Version | Plugin Name/Version`.
     * @var {string}
     */
    this.userAgent = `Node.js/${process.version.length ? process.version : '0.0.0'} | Akismet.js/${require('../package.json').version}`;

    // Initialize the instance.
    if(typeof options == 'object' && options) {
      for(let key in options) {
        let option = options[key];
        if(this.hasOwnProperty(key) && typeof option != 'undefined') this[key] = option;
      }
    }
  }

  /**
   * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
   * @param {Comment} comment The comment to be checked.
   * @return {Promise} A boolean value indicating whether it is spam.
   */
  checkComment(comment) {
    let serviceUrl = url.parse(this.serviceUrl);

    let endPoint = (
      serviceUrl.host != Client.DEFAULT_SERVICE ?
      url.resolve(this.serviceUrl, enums.EndPoints.CHECK_COMMENT) :
      `${serviceUrl.protocol}//${this.apiKey}.${serviceUrl.host}${enums.EndPoints.CHECK_COMMENT}`
    );

    let fields = JSON.parse(comment.toJSON());
    return this._queryService(endPoint, fields).then(res => res == 'true');
  }

  /**
   * Submits the specified comment that was incorrectly marked as spam but should not have been.
   * @param {Comment} comment The comment to be submitted.
   * @return {Promise} Completes once the comment has been submitted.
   */
  submitHam(comment) {
    let serviceUrl = url.parse(this.serviceUrl);

    let endPoint = (
      serviceUrl.host != Client.DEFAULT_SERVICE ?
      url.resolve(this.serviceUrl, enums.EndPoints.SUBMIT_HAM) :
      `${serviceUrl.protocol}//${this.apiKey}.${serviceUrl.host}${enums.EndPoints.SUBMIT_HAM}`
    );

    return this._queryService(endPoint, JSON.parse(comment.toJSON()));
  }

  /**
   * Submits the specified comment that was not marked as spam but should have been.
   * @param {Comment} comment The comment to be submitted.
   * @return {Promise} Completes once the comment has been submitted.
   */
  submitSpam(comment) {
    let serviceUrl = url.parse(this.serviceUrl);

    let endPoint = (
      serviceUrl.host != Client.DEFAULT_SERVICE ?
      url.resolve(this.serviceUrl, enums.EndPoints.SUBMIT_SPAM) :
      `${serviceUrl.protocol}//${this.apiKey}.${serviceUrl.host}${enums.EndPoints.SUBMIT_SPAM}`
    );

    return this._queryService(endPoint, JSON.parse(comment.toJSON()));
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return this.constructor.name+' '+JSON.stringify(this, null, 2);
  }

  /**
   * Checks the API key against the service database, and returns a value indicating whether it is valid.
   * @return {Promise} A boolean value indicating whether it is a valid API key.
   */
  verifyKey() {
    let endPoint = url.resolve(this.serviceUrl, enums.EndPoints.VERIFY_KEY);
    return this._queryService(endPoint, {}).then(res => res == 'valid');
  }

  /**
   * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
   * @param {string} endPoint The URL of the end point to query.
   * @param {object} fields The fields describing the query body.
   * @return {Promise} The response as string.
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
      .set(typeof window != 'undefined' ? enums.HTTPHeaders.X_USER_AGENT : 'user-agent', this.userAgent)
      .end((err, res) => {
        if(err || !res.ok)
          reject(new Error(err ? err.status : res.status));
        else {
          let akismetHeader = enums.HTTPHeaders.X_AKISMET_DEBUG_HELP;
          if(akismetHeader in res.header) reject(new Error(res.header[akismetHeader]));
          else resolve(res.text);
        }
      })
    );
  }
}

/**
 * The host of the default remote service.
 * @var {string}
 * @readonly
 */
Client.DEFAULT_SERVICE = 'rest.akismet.com';

// Public interface.
module.exports = {
  Blog,
  Client
};
