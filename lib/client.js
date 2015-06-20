/**
 * Contains classes that provide a simple programming interface for querying the [Akismet](https://akismet.com) service.
 * @module client
 */
'use strict';

// Module dependencies.
var enums=require('./enums');
var request=require('superagent');
var url=require('url');
var util=require('util');

/**
 * Represents the front page or home URL transmitted when making requests.
 * @class akismet.Blog
 * @constructor
 * @param {String} url The blog or site URL.
 * @param {Object} [options] An object specifying additional values used to initialize this instance.
 */
function Blog(url, options) {

  /**
   * The character encoding for the values included in comments.
   * @property charset
   * @type String
   * @default null
   */
  this.charset=null;

  /**
   * The language(s) in use on the blog or site, in ISO 639-1 format, comma-separated.
   * @property language
   * @type String
   * @default null
   */
  this.language=null;

  /**
   * The blog or site URL.
   * @property url
   * @type String
   */
  this.url=(typeof url=='string' ? url : null);

  // Initialize the instance.
  if(typeof options=='object' && options) {
    for(var key in options) {
      var option=options[key];
      if(this.hasOwnProperty(key) && typeof option!='undefined') this[key]=option;
    }
  }
}

/**
 * Creates a new author from the specified JSON string.
 * @method fromJSON
 * @param {Object|String} json A JSON string, or an already parsed object, representing an author.
 * @return {akismet.Blog} The instance corresponding to the specified JSON object, or `null` if a parsing error occurred.
 * @static
 */
Blog.fromJSON=function(json) {
  var map;
  if(typeof json!='string') map=json;
  else {
    try { map=JSON.parse(json); }
    catch(e) { return null; }
  }

  return !map || typeof map!='object' ? null : new Blog(map.blog, {
    charset: map.blog_charset,
    language: map.blog_lang
  });
};

/**
 * Converts this object to a string in JSON format.
 * @method toJSON
 * @param {Number|String} [space] Causes the resulting string to be pretty-printed.
 * @return {String} The JSON representation of this object.
 */
Blog.prototype.toJSON=function(space) {
  var map={};
  if(typeof this.url=='string') map.blog=this.url;
  if(typeof this.charset=='string') map.blog_charset=this.charset;
  if(typeof this.language=='string') map.blog_lang=this.language;
  return JSON.stringify(map, null, space);
};

/**
 * Returns a string representation of this object.
 * @method toString
 * @return {String} The string representation of this object.
 */
Blog.prototype.toString=function() {
  return this.constructor.name+' '+JSON.stringify(this, null, 2);
};

/**
 * Provides the base class for clients that submit comments to [Akismet](https://akismet.com) service.
 * @class akismet.Client
 * @constructor
 * @param {String} apiKey The Akismet API key used to query the service.
 * @param {String|akismet.Blog} blog The front page or home URL transmitted when making requests.
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
   * @type akismet.Blog
   */
  this.blog=(blog instanceof Blog ? blog : new Blog(blog));
  
  /**
   * Value indicating whether the client operates in test mode.
   * You can use it when submitting test queries to Akismet.
   * @property isTest
   * @type Boolean
   * @default false
   */
  this.isTest=false;

  /**
   * The URL of the remote service.
   * @property serviceUrl
   * @type String
   * @default "https://rest.akismet.com"
   */
  this.serviceUrl='https://'+Client.DEFAULT_SERVICE;

  /**
   * The user agent string to use when making requests.
   * If possible, the user agent string should always have the following format: `Application Name/Version | Plugin Name/Version`.
   * @property userAgent
   * @type String
   */
  this.userAgent=util.format('Node.js/%s | Akismet.js/%s', process.version.length ? process.version : '0.0.0', require('../package.json').version);

  // Initialize the instance.
  if(typeof options=='object' && options) {
    for(var key in options) {
      var option=options[key];
      if(this.hasOwnProperty(key) && typeof option!='undefined') this[key]=option;
    }
  }
}

/**
 * The host of the default remote service.
 * @property DEFAULT_SERVICE
 * @type String
 * @static
 * @final
 */
Client.DEFAULT_SERVICE='rest.akismet.com';

/**
 * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
 * @method checkComment
 * @param {akismet.Comment} comment The comment to be checked.
 * @return {Promise} A boolean value indicating whether it is spam.
 * @async
 */
Client.prototype.checkComment=function(comment) {
  var serviceUrl=url.parse(this.serviceUrl);

  var endPoint=(
    serviceUrl.host!=Client.DEFAULT_SERVICE ?
    url.resolve(this.serviceUrl, enums.EndPoints.CHECK_COMMENT) :
    util.format('%s//%s.%s%s',
      serviceUrl.protocol,
      this.apiKey,
      serviceUrl.host,
      enums.EndPoints.CHECK_COMMENT
    )
  );

  var fields=JSON.parse(comment.toJSON());
  return this._queryService(endPoint, fields).then(function(res) {
    return res=='true';
  });
};

/**
 * Submits the specified comment that was incorrectly marked as spam but should not have been.
 * @method submitHam
 * @param {akismet.Comment} comment The comment to be submitted.
 * @return {Promise} Completes once the comment has been submitted.
 * @async
 */
Client.prototype.submitHam=function(comment) {
  var serviceUrl=url.parse(this.serviceUrl);

  var endPoint=(
    serviceUrl.host!=Client.DEFAULT_SERVICE ?
    url.resolve(this.serviceUrl, enums.EndPoints.SUBMIT_HAM) :
    util.format('%s//%s.%s%s',
      serviceUrl.protocol,
      this.apiKey,
      serviceUrl.host,
      enums.EndPoints.SUBMIT_HAM
    )
  );

  return this._queryService(endPoint, JSON.parse(comment.toJSON()));
};

/**
 * Submits the specified comment that was not marked as spam but should have been.
 * @method submitSpam
 * @param {akismet.Comment} comment The comment to be submitted.
 * @return {Promise} Completes once the comment has been submitted.
 * @async
 */
Client.prototype.submitSpam=function(comment) {
  var serviceUrl=url.parse(this.serviceUrl);

  var endPoint=(
    serviceUrl.host!=Client.DEFAULT_SERVICE ?
    url.resolve(this.serviceUrl, enums.EndPoints.SUBMIT_SPAM) :
    util.format('%s//%s.%s%s',
      serviceUrl.protocol,
      this.apiKey,
      serviceUrl.host,
      enums.EndPoints.SUBMIT_SPAM
    )
  );

  return this._queryService(endPoint, JSON.parse(comment.toJSON()));
};

/**
 * Returns a string representation of this object.
 * @method toString
 * @return {String} The string representation of this object.
 */
Client.prototype.toString=function() {
  return this.constructor.name+' '+JSON.stringify(this, null, 2);
};

/**
 * Checks the API key against the service database, and returns a value indicating whether it is valid.
 * @method verifyKey
 * @return {Promise} A boolean value indicating whether it is a valid API key.
 * @async
 */
Client.prototype.verifyKey=function() {
  var endPoint=url.resolve(this.serviceUrl, enums.EndPoints.VERIFY_KEY);
  return this._queryService(endPoint, {}).then(function(res) {
    return res=='valid';
  });
};

/**
 * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
 * @method _queryService
 * @param {String} endPoint The URL of the end point to query.
 * @param {Object} fields The fields describing the query body.
 * @return {Promise} The response as string.
 * @async
 * @private
 */
Client.prototype._queryService=function(endPoint, fields) {
  fields.key=this.apiKey;
  fields.blog=this.blog.url;
  if(this.blog.charset) fields.blog_charset=this.blog.charset;
  if(this.blog.lang) fields.blog_lang=this.blog.lang;
  if(this.isTest) fields.is_test='true';

  var self=this;
  return new Promise(function(resolve, reject) {
    request.post(endPoint)
      .type('form')
      .send(fields)
      .set(typeof window!='undefined' ? enums.HTTPHeaders.X_USER_AGENT : 'user-agent', self.userAgent)
      .end(function(err, res) {
        if(err || !res.ok) reject(new Error(err ? err.status : res.status));
        else {
          var akismetHeader=enums.HTTPHeaders.X_AKISMET_DEBUG_HELP;
          if(akismetHeader in res.header) reject(new Error(res.header[akismetHeader]));
          else resolve(res.text);
        }
      });
  });
};

// Public interface.
module.exports={
  Blog: Blog,
  Client: Client
};
