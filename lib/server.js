/**
 * Provides an HTTP server for relaying queries from clients to the [Akismet](https://akismet.com) service.
 * @module server
 */
'use strict';

// Module dependencies.
var client=require('./client');
var comment=require('./comment');
var enums=require('./enums');
var express=require('express');
var http=require('http');
var url=require('url');
var util=require('util');

/**
 * Adds [CORS](http://www.w3.org/TR/cors) headers to the res.
 * @method _addCORSHeaders
 * @for Server
 * @param {express.Request} req The request sent by a client.
 * @param {express.Response} res The response sent by the server.
 * @param {Function} next The callback used to pass the request off to the next middleware.
 * @static
 * @private
 */
function _addCORSHeaders(req, res, next) {
  res.set('access-control-allow-headers', util.format('%s, %s', enums.HTTPHeaders.X_REQUESTED_WITH, enums.HTTPHeaders.X_USER_AGENT));
  res.set('access-control-allow-methods', 'GET, OPTIONS, POST');
  res.set('access-control-allow-origin', '*');
  res.set('access-control-expose-headers', enums.HTTPHeaders.X_AKISMET_DEBUG_HELP);
  next();
}

/**
 * Processes the specified request body and returns the parsed `Client` and `Comment` in a map.
 * @method _processRequest
 * @for Server
 * @param {express.Request} req The request sent by a client.
 * @param {express.Response} res The response sent by the server.
 * @param {Function} next The callback used to pass the request off to the next middleware.
 * @return {Object} TODO:
 * - `client` TODO
 * - `comment` TODO
 * @static
 * @private
 */
function _processRequest(req, res, next) {

  // Parse client arguments.



  // Parse comment values.

  req.akismet={
    client: new client.Client(),
    comment: new comment.Comment()
  };

  next();
}

/**
 * Sends the specified response body.
 * @method _sendResponse
 * @for Server
 * @param {express.Response} res The response sent by the server.
 * @param {String} body The response body to send to the client.
 * @param {String} [error] An error message to add to the response headers as `X-akismet-debug-help`.
 * @static
 * @private
 */
function _sendResponse(res, body, error) {
  res.type('text/plain; charset=utf-8');
  if(typeof error=='string') res.set(enums.HTTPHeaders.X_AKISMET_DEBUG_HELP, error);
  res.send(body);
}

/**
 * An HTTP server that acts as a proxy between clients and the [Akismet](https://akismet.com) service.
 * @class Server
 * @constructor
 * @param {Object} [options] An object specifying values used to initialize this instance.
 */
function Server(options) {

  /**
   * The URL to redirect the user when a request is unhandled.
   * If this property is `null`, a 404 status code is sent instead of redirecting.
   * @property redirectUrl
   * @type String
   */
  this.redirectUrl=null;

  /**
   * The underlying [Express](http://expressjs.com/api.html#express) instance used to serve requests.
   * @property _express
   * @type Function
   * @private
   */
  this._express=express();

  // Initialize the instance.
  if(options && typeof options=='object')
    for(var key in options)
      if(this.hasOwnProperty(key) && options[key]) this[key]=options[key];
}

/**
 * Checks a `Comment` against the service database, and prints a value indicating whether it is spam.
 * @method checkComment
 * @param {express.Request} req The request sent by a client.
 * @param {express.Response} res The response sent by the server.
 */
Server.prototype.checkComment=function(req, res) {
  var client=req.akismet.client;
  var comment=req.akismet.comment;

  client.checkComment(comment, function(err, isSpam) {
    if(err) return _sendResponse(res, 'invalid', err);
    _sendResponse(res, isSpam ? 'true' : 'false');
  });
};

/**
 * Starts listening for HTTP requests on the specified address and port.
 * @method start
 * @param {String} address TODO
 * @param {Number} port TODO
 * @param {Function} callback The callback to invoke when the server is started.
 * @async
 */
Server.prototype.start=function(address, port, callback) {
  if(typeof callback!='function') callback=function() {};
  this._registerMiddleware();
  this._registerRoutes();
  if(typeof callback=='function') callback();
};

/**
 * Permanently stops this server from listening for new connections.
 * @method stop
 * @param {Function} callback The callback to invoke when the server is stopped.
 * @async
 */
Server.prototype.stop=function(callback) {
  if(typeof callback=='function') callback();
};

/**
 * Submits a `Comment` that was incorrectly marked as spam but should not have been.
 * @method submitHam
 * @param {express.Request} req The request sent by a client.
 * @param {express.Response} res The response sent by the server.
 */
Server.prototype.submitHam=function(req, res) {
  var client=req.akismet.client;
  var comment=req.akismet.comment;

  client.submitHam(comment, function(err) {
    if(err) return _sendResponse(res, '', err);
    _sendResponse(res, 'Thanks for making the web a better place.');
  });
};

/**
 * Submits a `Comment` that was not marked as spam but should have been.
 * @method submitSpam
 * @param {express.Request} req The request sent by a client.
 * @param {express.Response} res The response sent by the server.
 */
Server.prototype.submitSpam=function(req, res) {
  var client=req.akismet.client;
  var comment=req.akismet.comment;

  client.submitSpam(comment, function(err) {
    if(err) return _sendResponse(res, '', err);
    _sendResponse(res, 'Thanks for making the web a better place.');
  });
};

/**
 * Checks an API key against the service database, and prints a value indicating whether it is a valid key.
 * @method verifyKey
 * @param {express.Request} req The request sent by a client.
 * @param {express.Response} res The response sent by the server. The response sent by the server.
 */
Server.prototype.verifyKey=function(req, res) {
  var client=req.akismet.client;
  client.verifyKey(function(err, isValid) {
    if(err) return _sendResponse(res, 'invalid', err);
    _sendResponse(res, isValid ? 'valid' : 'invalid');
  });
};

/**
 * Registers the middleware.
 * @method _registerMiddleware
 * @private
 */
Server.prototype._registerMiddleware=function() {
  var app=this._express;

  app.use(express.logger(app.get('env')!='production' ? 'dev' : 'default'));
  app.use(express.urlencoded());
  app.use(_addCORSHeaders);
  app.use(app.router);
  // TODO: error handler app.use(this.controllers.main.error.bind(this.controllers.main));
};

/**
 * Registers the route table.
 * @method _registerRoutes
 * @private
 */
Server.prototype._registerRoutes=function() {
  var app=this._express;

  app.post(enums.EndPoints.CHECK_COMMENT, _processRequest, this.checkComment);
  app.post(enums.EndPoints.SUBMIT_HAM, _processRequest, this.submitHam);
  app.post(enums.EndPoints.SUBMIT_HAM, _processRequest, this.submitSpam);
  app.post(enums.EndPoints.VERIFY_KEY, _processRequest, this.verifyKey);

  var self=this;
  app.all('*', function(req, res) {
    if(req.method=='OPTIONS') return res.send(204);
    if(typeof self.redirectUrl=='string') return res.redirect(301, url.resolve(self.redirectUrl, req.url));
    res.send(404);
  });
};

// Public interface.
module.exports=Server;
