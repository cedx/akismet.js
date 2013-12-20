/**
 * Contains classes that provide a simple programming interface for querying [Akismet](https://akismet.com) service.
 * @module client
 */
'use strict';

// Module dependencies.
var util=require('util');
var request=require('request');

/**
 * Provides the URLs corresponding to the service end points.
 * @class EndPoints
 * @static
 */
var EndPoints={

  /**
   * URL of the [comment check](https://akismet.com/development/api/#comment-check) end point.
   * @property CHECK_COMMENT
   * @type String
   * @static
   * @final
   */
  CHECK_COMMENT: '/1.1/comment-check',

  /**
   * URL of the [submit ham](https://akismet.com/development/api/#submit-ham) end point.
   * @property SUBMIT_HAM
   * @type String
   * @static
   * @final
   */
  SUBMIT_HAM: '/1.1/submit-ham',

  /**
   * URL of the [submit spam](https://akismet.com/development/api/#submit-spam) end point.
   * @property SUBMIT_SPAM
   * @type String
   * @static
   * @final
   */
  SUBMIT_SPAM: '/1.1/submit-spam',

  /**
   * URL of the [key verification](https://akismet.com/development/api/#verify-key) end point.
   * @property VERIFY_KEY
   * @type String
   * @static
   * @final
   */
  VERIFY_KEY: '/1.1/verify-key'
};

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
  this.userAgent=null;

  /**
   * A value indicating whether to use secure requests when querying the service database.
   * @property useSecureRequests
   * @type Boolean
   * @default false
   */
  this.useSecureRequests=false;

  // Initialize the instance.
  if(typeof options=='object')
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
    EndPoints.CHECK_COMMENT
  );

  _queryService(endPoint, JSON.parse(comment.toJSON()), function(err, res) {
    if(err) return callback(err, null);
    callback(null, res=='true');
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
    EndPoints.SUBMIT_HAM
  );

  _queryService(endPoint, JSON.parse(comment.toJSON()), callback);
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
    EndPoints.SUBMIT_SPAM
  );

  _queryService(endPoint, JSON.parse(comment.toJSON()), callback);
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
    EndPoints.VERIFY_KEY
  );

  _queryService(endPoint, { key: this.apiKey }, function(err, res) {
    if(err) return callback(err, null);
    callback(null, res=='valid');
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
  if(typeof(fields)!='object') fields={};
  fields.blog=this.blog;

  var options={
    body: fields,
    encoding: 'utf-8',
    headers: { 'user-agent': this.userAgent },
    url: endPoint
  };

  request.post(options, function(err, res, body) {
    if(err) return callback(err, null);
    if(res.statusCode!=200) return callback(new Error(res.statusCode.toString()+' Internal Server Error'), null);
    if('x-akismet-debug-help' in res.headers) return callback(new Error('400 '+res.headers['x-akismet-debug-help']), body);
    callback(null, body);
  });
};

// Public interface.
module.exports={ Client: Client };
