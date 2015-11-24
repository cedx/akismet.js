/**
 * Provides an HTTP server for relaying queries from clients to the [Akismet](https://akismet.com) service.
 * @module server
 */
'use strict';

// Module dependencies.
const bodyParser=require('body-parser');
const cors=require('cors');
const EventEmitter=require('events').EventEmitter;
const express=require('express');
const http=require('http');
const https=require('https');
const url=require('url');
const util=require('util');

const clt=require('./client');
const cmt=require('./comment');
const enums=require('./enums');

/**
 * An HTTP server that acts as a proxy between clients and the [Akismet](https://akismet.com) service.
 * @class akismet.Server
 * @constructor
 * @param {object} [options] An object specifying values used to initialize this instance.
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
   * @type Function
   * @private
   */
  this._express=express();
  this._express.disable('x-powered-by');
  this._registerMiddleware();
  this._registerRoutes();

  /**
   * The underlying HTTP(S) service listening for requests.
   * @type {http.Server|https.Server}
   * @private
   */
  this._httpService=null;

  /**
   * The server settings.
   * @var {object}
   * @private
   */
  this._options=(options || {});
}

// Prototype chain.
util.inherits(Server, EventEmitter);

/**
 * The host that the server is listening on.
 * @property host
 * @var string
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
 * @var string
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
 * @param {express.Request} req The request sent by a client.
 * @param {express.Response} res The response sent by the server.
 * @return {Promise} Completes once the comment has been checked.
 * @async
 */
Server.prototype.checkComment=function(req, res) {
  var client=req.akismet.client;
  var self=this;
  return client.checkComment(req.akismet.comment).then(
    function(isSpam) { Server._sendResponse(res, isSpam ? 'true' : 'false'); },
    function(err) { Server._sendResponse(res, 'invalid', err); self.emit('error', err); }
  );
};

/**
 * Stops the server from accepting new connections.
 * @return {Promise} Completes when the server is finally closed.
 * @async
 */
Server.prototype.close=function() {
  if(!this._httpService) return Promise.resolve();

  var self=this;
  return new Promise(function(resolve) {
    self._httpService.close(function() {
      self._httpService=null;
      self.emit('close');
      resolve();
    });
  });
};

/**
 * Begin accepting connections.
 * @param {number} port The port that the server should run on.
 * @param {string} [host] The host that the server should run on.
 * @return {Promise} Completes when the server has been started.
 * @async
 */
Server.prototype.listen=function(port, host) {
  this._httpService=('ssl' in this._options ? https.createServer(this._options.ssl, this._express) : http.createServer(this._express));

  var self=this;
  this._httpService.on('clientError', function(err) { self.emit('error', err); });
  this._httpService.on('request', function(req, res) { self.emit('request', req, res); });

  return new Promise(function(resolve) {
    self._httpService.listen(port, host, function() {
      self._options.host=host;
      self._options.port=port;
      self.emit('listening');
      resolve();
    });
  });
};

/**
 * Submits a comment that was incorrectly marked as spam but should not have been.
 * @param {express.Request} req The request sent by a client.
 * @param {express.Response} res The response sent by the server.
 * @return {Promise} Completes once the comment has been submitted.
 * @async
 */
Server.prototype.submitHam=function(req, res) {
  var client=req.akismet.client;
  var self=this;
  return client.submitHam(req.akismet.comment).then(
    function() { Server._sendResponse(res, 'Thanks for making the web a better place.'); },
    function(err) { Server._sendResponse(res, '', err); self.emit('error', err); }
  );
};

/**
 * Submits a comment that was not marked as spam but should have been.
 * @param {express.Request} req The request sent by a client.
 * @param {express.Response} res The response sent by the server.
 * @return {Promise} Completes once the comment has been submitted.
 * @async
 */
Server.prototype.submitSpam=function(req, res) {
  var client=req.akismet.client;
  var self=this;
  return client.submitSpam(req.akismet.comment).then(
    function() { Server._sendResponse(res, 'Thanks for making the web a better place.'); },
    function(err) { Server._sendResponse(res, '', err); self.emit('error', err); }
  );
};

/**
 * Checks an API key against the service database, and prints a value indicating whether it is a valid key.
 * @param {express.Request} req The request sent by a client.
 * @param {express.Response} res The response sent by the server. The response sent by the server.
 * @return {Promise} Completes once the API key has been checked.
 * @async
 */
Server.prototype.verifyKey=function(req, res) {
  var client=req.akismet.client;
  var self=this;
  return client.verifyKey().then(
    function(isValid) { Server._sendResponse(res, isValid ? 'valid' : 'invalid'); },
    function(err) { Server._sendResponse(res, 'invalid', err); self.emit('error', err); }
  );
};

/**
 * Processes the specified request body.
 * @param {express.Request} req The request sent by a client.
 * @param {express.Response} res The response sent by the server.
 * @param {Function} next The callback used to pass the request off to the next middleware.
 * @static
 * @async
 * @private
 */
Server._processRequest=function(req, res, next) {
  // Parse client arguments.
  var apiKey=('key' in req.body ? req.body.key : req.hostname.split('.')[0]);
  var userAgent=(enums.HTTPHeaders.X_USER_AGENT in req.headers ? req.headers[enums.HTTPHeaders.X_USER_AGENT] : req.headers['user-agent']);
  var client=new clt.Client(apiKey, clt.Blog.fromJSON(req.body), { userAgent: userAgent });

  // Parse comment values.
  var comment=cmt.Comment.fromJSON(req.body);
  if(!comment.author) comment.author=new cmt.Author();
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
 * @private
 */
Server.prototype._registerMiddleware=function() {
  this._express.use(cors({
    allowedHeaders: [ enums.HTTPHeaders.X_REQUESTED_WITH, enums.HTTPHeaders.X_USER_AGENT ],
    exposedHeaders: [ enums.HTTPHeaders.X_AKISMET_DEBUG_HELP ],
    methods: ['GET', 'POST'],
    origin: '*'
  }));

  this._express.use(bodyParser.urlencoded({ extended: true }));
  this._express.use(Server._processRequest);
};

/**
 * Registers the route table.
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
 * @param {express.Response} res The response sent by the server.
 * @param {string} body The response body to send to the client.
 * @param {object} [error] An error message to add to the response headers as `akismet.HTTPHeaders.X_AKISMET_DEBUG_HELP`.
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
