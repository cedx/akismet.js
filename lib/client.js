/**
 * Contains classes that provide a simple programming interface for querying the [Akismet](https://akismet.com) service.
 * @module client
 */
'use strict';

// Module dependencies.
var agent=require('superagent').agent;
var enums=require('./enums');
var util=require('util');
var version=require('../package.json').version;

/**
 * Provides the base class for clients that submit comments to [Akismet](https://akismet.com) service.
 * @class Client
 * @constructor
 * @param {String} apiKey The Akismet API key used to query the service.
 * @param {String} blog The front page or home URL transmitted when making requests.
 * @param {Object} [options] An object specifying additional values used to initialize this instance.
 */
function Client(apiKey, blog, options) {

  /**
   * The Akismet API key.
   * @property apiKey
   * @type String
   */
  this.apiKey=String(apiKey);

  /**
   * The front page or home URL of the instance making requests.
   * @property blog
   * @type String
   */
  this.blog=String(blog);

  /**
   * The user agent string to use when making requests.
   * If possible, the user agent string should always have the following format: `Application Name/Version | Plugin Name/Version`.
   * @property userAgent
   * @type String
   */
  this.userAgent=util.format('Node.js/%s | Akismet.js/%s', process.version, version);

  /**
   * A value indicating whether to use secure requests when querying the service database.
   * @property useSecureRequests
   * @type Boolean
   * @default false
   */
  this.useSecureRequests=false;

  // Initialize the instance.
  if(options && typeof options=='object')
    for(var key in options)
      if(this.hasOwnProperty(key) && options[key]) this[key]=options[key];
}

/**
 * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
 * @method checkComment
 * @param {Function} callback The callback to invoke at the end. It is passed two arguments:
 * - `error` containing the error that occurred, if any.
 * - `isSpam` indicating whether the specified comment is spam.
 * @async
 */
Client.prototype.checkComment=function(comment, callback) {
  var endPoint=util.format('%s://%s.rest.akismet.com%s',
    this.useSecureRequests ? 'https' : 'http',
    this.apiKey,
    enums.EndPoints.CHECK_COMMENT
  );

  this._queryService(endPoint, JSON.parse(comment.toJSON()), function(err, res) {
    if(err) callback(err);
    else callback(null, res=='true');
  });
};

/**
 * Submits the specified comment that was incorrectly marked as spam but should not have been.
 * @method submitHam
 * @param {Function} callback The callback to invoke at the end. It is passed one argument `error` containing the error that occurred, if any.
 * @async
 */
Client.prototype.submitHam=function(comment, callback) {
  var endPoint=util.format('%s://%s.rest.akismet.com%s',
    this.useSecureRequests ? 'https' : 'http',
    this.apiKey,
    enums.EndPoints.SUBMIT_HAM
  );

  this._queryService(endPoint, JSON.parse(comment.toJSON()), callback);
};

/**
 * Submits the specified comment that was not marked as spam but should have been.
 * @method submitSpam
 * @param {Function} callback The callback to invoke at the end. It is passed one argument `error` containing the error that occurred, if any.
 * @async
 */
Client.prototype.submitSpam=function(comment, callback) {
  var endPoint=util.format('%s://%s.rest.akismet.com%',
    this.useSecureRequests ? 'https' : 'http',
    this.apiKey,
    enums.EndPoints.SUBMIT_SPAM
  );

  this._queryService(endPoint, JSON.parse(comment.toJSON()), callback);
};

/**
 * Returns a string representation of this object.
 * @method toString
 * @return {String} The string representation of this object.
 */
Client.prototype.toString=function() {
  return util.format('Client { apiKey: "%s", blog: "%s", userAgent: "%s" }',
    this.apiKey,
    this.blog,
    this.userAgent
  );
};

/**
 * Checks the API key against the service database, and returns a value indicating whether it is valid.
 * @method verifyKey
 * @param {Function} callback The callback to invoke at the end. It is passed two arguments:
 * - `error` containing the error that occurred, if any.
 * - `isValid` indicating whether the API key is valid.
 * @async
 */
Client.prototype.verifyKey=function(callback) {
  var endPoint=util.format('%s://rest.akismet.com%s',
    this.useSecureRequests ? 'https' : 'http',
    enums.EndPoints.VERIFY_KEY
  );

  this._queryService(endPoint, { key: this.apiKey }, function(err, res) {
    if(err) callback(err);
    else callback(null, res=='valid');
  });
};

/**
 * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
 * @method _queryService
 * @param {String} endPoint URL of the end point to query.
 * @param {Object} fields Fields describing the query body.
 * @param {Function} callback The callback to invoke at the end. It is passed two arguments:
 * - `error` containing the error that occurred, if any.
 * - `response` containing the response body returned by the remote service.
 * @private
 * @async
 */
Client.prototype._queryService=function(endPoint, fields, callback) {
  if(!fields || typeof(fields)!='object') fields={};
  fields.blog=this.blog;

  agent()
    .post(endPoint)
    .type('form')
    .set('user-agent', this.userAgent)
    .send(fields)
    .end(function(err, res) {
      if(err) callback(err);
      else if(res.status!=200) callback(new Error(res.status));
      else {
        var akismetHeader=enums.HTTPHeaders.X_AKISMET_DEBUG_HELP;
        callback(akismetHeader in res.header ? new Error(res.header[akismetHeader]) : null, res.text);
      }
    });
};

// Public interface.
module.exports=Client;
