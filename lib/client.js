/**
 * Contains classes that provide a simple programming interface for querying [Akismet](https://akismet.com) service.
 * @module client
 */
'use strict';

// Module dependencies.
var util=require('util');

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
 * A collection of HTTP headers and their values.
 * @class HTTPHeaders
 * @static
 */
var HTTPHeaders={

  /**
   * Header corresponding to [Akismet](https://akismet.com) debug messages.
   * @property AKISMET_DEBUG_HELP
   * @type String
   * @static
   * @final
   */
  AKISMET_DEBUG_HELP: 'X-akismet-debug-help',

  /**
   * Header corresponding to the user agent string.
   * @property USER_AGENT
   * @type String
   * @static
   * @final
   */
  USER_AGENT: 'User-Agent',

  /**
   * Header used to identify an AJAX request.
   * @property X_REQUESTED_WITH
   * @type String
   * @static
   * @final
   */
  X_REQUESTED_WITH: 'X-Requested-With',

  /**
   * Custom header corresponding to the user agent string sent by AJAX clients.
   * @property X_USER_AGENT
   * @type String
   * @static
   * @final
   */
  X_USER_AGENT: 'X-User-Agent'
};

/**
 * Provides the base class for clients that submit comments to [Akismet](https://akismet.com) service.
 * @class Client
 * @constructor
 * @param {Object} properties An object specifying values used to initialize this object.
 */
function Client(properties) {

  /**
   * The Akismet API key.
   * @property apiKey
   * @type String
   */
  this.apiKey=null;

  /**
   * The front page or home URL of the instance making requests.
   * @property blog
   * @type String
   */
  this.blog=null;

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
  if(typeof properties=='object')
    for(var key in properties)
      if(this.hasOwnProperty(key) && properties[key]) this[key]=properties[key];
}

/**
 * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
 * @method checkComment
 * @param {Function} callback The callback to invoke at the end. It is passed two arguments:
 * - `err` containing the error that occurred, if any.
 * - `isSpam` indicating whether the specified comment is spam.
 * @async `(err, isSpam)`
 */
Client.prototype.checkComment=function(comment, callback) {
  var endPoint=util.format('%s://%s%s',
    this.useSecureRequests ? 'https' : 'http',
    this.apiKey+'.rest.akismet.com',
    EndPoints.CHECK_COMMENT
  );

  throw new Error('Not implemented.');
  // _queryService(endPoint, comment.toJSON()).then((result) => result=='true');
};

/**
 * Submits the specified comment that was incorrectly marked as spam but should not have been.
 * @method submitHam
 * @param {Function} callback The callback to invoke at the end. It is passed one argument `err` containing the error that occurred, if any.
 * @async `(err)`
 */
Client.prototype.submitHam=function(comment, callback) {
  var endPoint=util.format('%s://%s%s',
    this.useSecureRequests ? 'https' : 'http',
    this.apiKey+'.rest.akismet.com',
    EndPoints.SUBMIT_HAM
  );

  throw new Error('Not implemented.');
  // _queryService(endPoint, comment.toJSON());
};

/**
 * Submits the specified comment that was not marked as spam but should have been.
 * @method submitSpam
 * @param {Function} callback The callback to invoke at the end. It is passed one argument `err` containing the error that occurred, if any.
 * @async `(err)`
 */
Client.prototype.submitSpam=function(comment, callback) {
  var endPoint=util.format('%s://%s%s',
    this.useSecureRequests ? 'https' : 'http',
    this.apiKey+'.rest.akismet.com',
    EndPoints.SUBMIT_SPAM
  );

  throw new Error('Not implemented.');
  // _queryService(endPoint, comment.toJSON());
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
 * - `err` containing the error that occurred, if any.
 * - `isValid` indicating whether the API key is valid.
 * @async
 */
Client.prototype.verifyKey=function(callback) {
  var endPoint=util.format('%s://%s%s',
      this.useSecureRequests ? 'https' : 'http',
      this.apiKey+'.rest.akismet.com',
      EndPoints.VERIFY_KEY
    );

  throw new Error('Not implemented.');
  //_queryService(endPoint, { key: this.apiKey }).then((result) => result=='valid');
};

/**
 * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
 * Throws a `HTTPError` if the remote service returned an error message.
 * @method _queryService
 * @param {String} endPoint URL of the end point to query.
 * @param {Object} fields Fields describing the query body.
 * @param {Function} callback The callback to invoke at the end. It is passed two arguments:
 * - `err` containing the error that occurred, if any.
 * - `res` containing the response returned by the service service.
 * @private
 * @async
 */
Client.prototype._queryService=function(endPoint, fields, callback) {
  if(typeof(fields)!='object') fields={};
  fields.blog=this.blog;

  throw new Error('Not implemented.');
  /*
  return http.post(endPoint, fields: fields, headers: { HTTPHeaders.USER_AGENT: userAgent }).then((response) {
    if(response.headers.containsKey(HTTPHeaders.AKISMET_DEBUG_HELP))
      throw new HTTPError(response.headers[HTTPHeaders.AKISMET_DEBUG_HELP], uri: endPoint);

    return response.body;
  });
  */
};

/**
 * Describes an error that occurred during the processing of HTTP requests.
 * @class HTTPError
 * @constructor
 * @param {Number} status The HTTP response status code sent to the client corresponding to this error.
 * @param {String} message The message displayed to the client when the error is thrown.
 * @extends Error
 */
function HTTPError(status, message) {
  Error.captureStackTrace(this, HTTPError);

  /**
   * The error message.
   * @property message
   * @type String
   */
  this.message=(typeof message=='string' ? message : '');

  /**
   * The error name.
   * @property name
   * @type String
   */
  this.name='HTTPError';

  /**
   * The HTTP response status code to return to the client.
   * @property status
   * @type Number
   */
  this.status=status;
}

// Public interface.
module.exports=Client;
