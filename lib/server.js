/**
 * Provides an HTTP server for relaying queries from clients to the [Akismet](https://akismet.com) service.
 * @module server
 */
'use strict';

// Module dependencies.
var bodyParser=require('body-parser');
var enums=require('./enums');
var cors=require('cors');
var express=require('express');
var http=require('http');
var https=require('https');
var url=require('url');
var util=require('util');

var Author=require('./comment').Author;
var Blog=require('./client').Blog;
var Client=require('./client').Client;
var Comment=require('./comment').Comment;
var EventEmitter=require('events').EventEmitter;

/**
 * An HTTP server that acts as a proxy between clients and the [Akismet](https://akismet.com) service.
 * @class akismet.Server
 * @constructor
 * @param {Object} [options] An object specifying values used to initialize this instance.
 */
function Server(options) {
  EventEmitter.call(this);

  /**
   * Emitted when the server closes.
   * @event close
   */

  /**
   * Emitted each time the server experiences an error.
   * @event error
   * @param {Error} err The emitted error event.
   */

  /**
   * Emitted when the server has been bound after calling `listen` method.
   * @event listening
   */

  /**
   * Emitted each time there is a request.
   * @event request
   * @param {http.IncomingMessage} req The request sent by the client.
   * @param {http.ServerResponse} res The response sent by the server.
   */

  /**
   * The underlying [Express](http://expressjs.com/api.html#express) application used for routing requests.
   * @property _express
   * @type Function
   * @private
   */
  this._express=express();
  this._express.disable('x-powered-by');
  this._registerMiddleware();
  this._registerRoutes();

  /**
   * The server settings.
   * @property _options
   * @type Object
   * @private
   */
  this._options=(options || {});

  /**
   * The underlying HTTP(S) service listening for requests.
   * @property _httpService
   * @type {http.Server|https.Server}
   * @private
   */
  this._httpService=null;
}

// Prototype chain.
util.inherits(Server, EventEmitter);

/**
 * The host that the server is listening on.
 * @property host
 * @type String
 * @final
 * @default "0.0.0.0"
 */
Object.defineProperty(Server.prototype, 'host', {
  get: function() {
    return typeof this._options.host=='string' ? this._options.host : '0.0.0.0';
  }
});

/**
 * The port that the server is listening on.
 * @property port
 * @type Number
 * @final
 * @default 3000
 */
Object.defineProperty(Server.prototype, 'port', {
  get: function() {
    return typeof this._options.port=='number' ? this._options.port : 3000;
  }
});

/**
 * The URL to redirect the user when a request is unhandled.
 * If this property is `null`, a 404 status code is sent instead of redirecting.
 * @property redirectUrl
 * @type String
 * @final
 * @default null
 */
Object.defineProperty(Server.prototype, 'redirectUrl', {
  get: function() {
    return 'redirectUrl' in this._options ? String(this._options.redirectUrl) : null;
  }
});

/**
 * Checks a comment against the service database, and prints a value indicating whether it is spam.
 * @method checkComment
 * @param {express.Request} req The request sent by a client.
 * @param {express.Response} res The response sent by the server.
 */
Server.prototype.checkComment=function(req, res) {
  var client=req.akismet.client;
  var comment=req.akismet.comment;
  client.checkComment(comment, function(err, isSpam) {
    if(err) Server._sendResponse(res, 'invalid', err);
    else Server._sendResponse(res, isSpam ? 'true' : 'false');
  });
};

/**
 * Stops the server from accepting new connections.
 * @method close
 * @param {Function} [callback] A callback to invoke when server is finally closed.
 * @async
 */
Server.prototype.close=function(callback) {
  if(this._httpService) {
    var self=this;
    this._httpService.close(function() {
      self._httpService=null;
      self.emit('close');
      if(callback instanceof Function) callback();
    });
  }
};

/**
 * Begin accepting connections.
 * @method listen
 * @param {Number} port The port that the server should run on.
 * @param {String} [host] The host that the server should run on.
 * @param {Function} [callback] A function to invoke when server is ready to process requests.
 * @async
 */
Server.prototype.listen=function(port, host, callback) {
  this._httpService=('ssl' in this._options ? https.createServer(this._options.ssl, this._express) : http.createServer(this._express));

  var self=this;
  this._httpService.on('clientError', function(err) { self.emit('error', err); });
  this._httpService.on('request', function(req, res) { self.emit('request', req, res); });

  this._httpService.listen(port, host, function() {
    self._options.host=host;
    self._options.port=port;
    self.emit('listening');
    if(callback instanceof Function) callback();
  });
};

/**
 * Submits a comment that was incorrectly marked as spam but should not have been.
 * @method submitHam
 * @param {express.Request} req The request sent by a client.
 * @param {express.Response} res The response sent by the server.
 */
Server.prototype.submitHam=function(req, res) {
  var client=req.akismet.client;
  var comment=req.akismet.comment;
  client.submitHam(comment, function(err) {
    if(err) Server._sendResponse(res, '', err);
    else Server._sendResponse(res, 'Thanks for making the web a better place.');
  });
};

/**
 * Submits a comment that was not marked as spam but should have been.
 * @method submitSpam
 * @param {express.Request} req The request sent by a client.
 * @param {express.Response} res The response sent by the server.
 */
Server.prototype.submitSpam=function(req, res) {
  var client=req.akismet.client;
  var comment=req.akismet.comment;
  client.submitSpam(comment, function(err) {
    if(err) Server._sendResponse(res, '', err);
    else Server._sendResponse(res, 'Thanks for making the web a better place.');
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
    if(err) Server._sendResponse(res, 'invalid', err);
    else Server._sendResponse(res, isValid ? 'valid' : 'invalid');
  });
};

/**
 * Processes the specified request body.
 * @method _processRequest
 * @param {express.Request} req The request sent by a client.
 * @param {express.Response} res The response sent by the server.
 * @param {Function} next The callback used to pass the request off to the next middleware.
 * @static
 * @private
 */
Server._processRequest=function(req, res, next) {
  // Parse client arguments.
  var apiKey=('key' in req.body ? req.body.key : req.hostname.split('.')[0]);
  var userAgent=(enums.HTTPHeaders.X_USER_AGENT in req.headers ? req.headers[enums.HTTPHeaders.X_USER_AGENT] : req.headers['user-agent']);
  var client=new Client(apiKey, Blog.fromJSON(req.body), { userAgent: userAgent });

  // Parse comment values.
  var comment=Comment.fromJSON(req.body);
  if(!comment.author) comment.author=new Author();
  if(!comment.author.ipAddress) comment.author.ipAddress=req.connection.remoteAddress;

  // Update request properties.
  req.akismet={
    client: client,
    comment: comment
  };

  next();
};

/**
 * Registers the middleware.
 * @method _registerMiddleware
 * @private
 */
Server.prototype._registerMiddleware=function() {
  this._express.use(cors({
    allowedHeaders: [ enums.HTTPHeaders.X_REQUESTED_WITH, enums.HTTPHeaders.X_USER_AGENT ],
    exposedHeaders: [ enums.HTTPHeaders.X_AKISMET_DEBUG_HELP ],
    methods: [ 'GET', 'POST' ],
    origin: '*'
  }));

  this._express.use(bodyParser.urlencoded({ extended: true }));
  this._express.use(Server._processRequest);
};

/**
 * Registers the route table.
 * @method _registerRoutes
 * @private
 */
Server.prototype._registerRoutes=function() {
  this._express.post(enums.EndPoints.CHECK_COMMENT, this.checkComment.bind(this));
  this._express.post(enums.EndPoints.SUBMIT_HAM, this.submitHam.bind(this));
  this._express.post(enums.EndPoints.SUBMIT_SPAM, this.submitSpam.bind(this));
  this._express.post(enums.EndPoints.VERIFY_KEY, this.verifyKey.bind(this));

  var self=this;
  this._express.all('*', function(req, res) {
    if(req.method=='OPTIONS') res.status(204).end();
    else {
      var redirect=self.redirectUrl;
      if(typeof redirect=='string') res.redirect(301, url.resolve(redirect, req.url));
      else res.status(404).send(http.STATUS_CODES[404]);
    }
  });
};

/**
 * Sends the specified response body.
 * @method _sendResponse
 * @param {express.Response} res The response sent by the server.
 * @param {String} body The response body to send to the client.
 * @param {Object} [error] An error message to add to the response headers as `akismet.HTTPHeaders.X_AKISMET_DEBUG_HELP`.
 * @static
 * @private
 */
Server._sendResponse=function(res, body, error) {
  res.type('text/plain; charset=utf-8');
  if(typeof error!='undefined') res.set(enums.HTTPHeaders.X_AKISMET_DEBUG_HELP, error.toString());
  res.send(body);
};

// Public interface.
module.exports=Server;
