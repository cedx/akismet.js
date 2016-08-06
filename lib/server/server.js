/**
 * Implementation of the `akismet.Server` class.
 * @module server/server
 */
const {Author, Blog, Comment, EndPoints, HTTPHeaders} = require('../core');
const bodyParser = require('body-parser');
const {Client} = require('../client');
const cors = require('cors');
const {EventEmitter} = require('events');
const express = require('express');
const http = require('http');
const https = require('https');
const url = require('url');

/**
 * An HTTP server that acts as a proxy between clients and the [Akismet](https://akismet.com) service.
 * @augments events.EventEmitter
 */
class Server extends EventEmitter {

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
   */

  /**
   * Initializes a new instance of the class.
   * @param {object} [options] An object specifying values used to initialize this instance.
   */
  constructor(options = {}) {
    super();

    /**
     * The underlying [Express](http://expressjs.com/api.html#express) application used for routing requests.
     * @type {function}
     * @private
     */
    this._express = express();
    this._express.disable('x-powered-by');
    this._registerMiddleware();
    this._registerRoutes();

    /**
     * The underlying HTTP(S) service listening for requests.
     * @type {(http.Server|https.Server)}
     * @private
     */
    this._httpService = null;

    /**
     * The server settings.
     * @type {object}
     * @private
     */
    this._options = options;
  }

  /**
   * The default host that the server is listening on.
   * @type {string}
   */
  static get DEFAULT_HOST() {
    return '0.0.0.0';
  }

  /**
   * The default port that the server is listening on.
   * @type {number}
   */
  static get DEFAULT_PORT() {
    return 3000;
  }

  /**
   * The host that the server is listening on.
   * @type {string}
   */
  get host() {
    return typeof this._options.host == 'string' ? this._options.host : Server.DEFAULT_HOST;
  }

  /**
   * The port that the server is listening on.
   * @type {number}
   */
  get port() {
    return typeof this._options.port == 'number' ? this._options.port : Server.DEFAULT_PORT;
  }

  /**
   * The URL to redirect the user when a request is unhandled.
   * If this property is empty, a 404 status code is sent instead of redirecting.
   * @type {string}
   */
  get redirectURL() {
    return typeof this._options.redirectURL == 'string' && this._options.redirectURL.length ? this._options.redirectURL : null;
  }

  /**
   * Checks a comment against the service database, and prints a value indicating whether it is spam.
   * @param {express.Request} req The request sent by a client.
   * @param {express.Response} res The response sent by the server.
   * @returns {Promise} Completes once the comment has been checked.
   * @throws {Error} The specified request is invalid.
   */
  checkComment(req, res) {
    if(!('akismet' in req) || !('client' in req.akismet)) throw new Error('Invalid request.');

    let client = req.akismet.client;
    return client.checkComment(req.akismet.comment).then(
      isSpam => Server._sendResponse(res, isSpam ? 'true' : 'false'),
      err => { Server._sendResponse(res, 'invalid', err); this.emit('error', err); }
    );
  }

  /**
   * Stops the server from accepting new connections.
   * @returns {Promise} Completes when the server is finally closed.
   */
  close() {
    if(!this._httpService) return Promise.resolve();

    return new Promise(resolve => this._httpService.close(() => {
      this._httpService = null;
      this.emit('close');
      resolve();
    }));
  }

  /**
   * Begin accepting connections.
   * @param {number} [port] The port that the server should run on.
   * @param {string} [host] The host that the server should run on.
   * @returns {Promise} Completes when the server has been started.
   */
  listen(port = -1, host = '') {
    if(port <= 0) port = this.port;
    if(!host.length) host = this.host;

    this._httpService =
      'ssl' in this._options ?
      https.createServer(this._options.ssl, this._express) :
      http.createServer(this._express);

    this._httpService.on('clientError', err => this.emit('error', err));
    this._httpService.on('request', req => this.emit('request', req));

    return new Promise(resolve => this._httpService.listen(port, host, () => {
      let address = this._httpService.address();
      this._options.host = address.address;
      this._options.port = address.port;

      this.emit('listening');
      resolve();
    }));
  }

  /**
   * Submits a comment that was incorrectly marked as spam but should not have been.
   * @param {express.Request} req The request sent by a client.
   * @param {express.Response} res The response sent by the server.
   * @returns {Promise} Completes once the comment has been submitted.
   * @throws {Error} The specified request is invalid.
   */
  submitHam(req, res) {
    if(!('akismet' in req) || !('client' in req.akismet)) throw new Error('Invalid request.');

    let client = req.akismet.client;
    return client.submitHam(req.akismet.comment).then(
      () => Server._sendResponse(res, 'Thanks for making the web a better place.'),
      err => { Server._sendResponse(res, '', err); this.emit('error', err); }
    );
  }

  /**
   * Submits a comment that was not marked as spam but should have been.
   * @param {express.Request} req The request sent by a client.
   * @param {express.Response} res The response sent by the server.
   * @returns {Promise} Completes once the comment has been submitted.
   * @throws {Error} The specified request is invalid.
   */
  submitSpam(req, res) {
    if(!('akismet' in req) || !('client' in req.akismet)) throw new Error('Invalid request.');

    let client = req.akismet.client;
    return client.submitSpam(req.akismet.comment).then(
      () => Server._sendResponse(res, 'Thanks for making the web a better place.'),
      err => { Server._sendResponse(res, '', err); this.emit('error', err); }
    );
  }

  /**
   * Checks an API key against the service database, and prints a value indicating whether it is a valid key.
   * @param {express.Request} req The request sent by a client.
   * @param {express.Response} res The response sent by the server. The response sent by the server.
   * @returns {Promise} Completes once the API key has been checked.
   * @throws {Error} The specified request is invalid.
   */
  verifyKey(req, res) {
    if(!('akismet' in req) || !('client' in req.akismet)) throw new Error('Invalid request.');

    let client = req.akismet.client;
    return client.verifyKey().then(
      isValid => Server._sendResponse(res, isValid ? 'valid' : 'invalid'),
      err => { Server._sendResponse(res, 'invalid', err); this.emit('error', err); }
    );
  }

  /**
   * Processes the specified request body.
   * @param {express.Request} req The request sent by a client.
   * @param {express.Response} res The response sent by the server.
   * @param {Function} next The callback used to pass the request off to the next middleware.
   * @private
   */
  static _processRequest(req, res, next) {
    // Parse client arguments.
    let apiKey = 'key' in req.body ? req.body.key : req.hostname.split('.')[0];
    let userAgent = HTTPHeaders.X_USER_AGENT in req.headers ? req.headers[HTTPHeaders.X_USER_AGENT] : req.headers['user-agent'];
    let client = new Client(apiKey, Blog.fromJSON(req.body), {userAgent});

    // Parse comment values.
    let comment = Comment.fromJSON(req.body);
    if(!comment.author) comment.author = new Author();
    if(!comment.author.ipAddress) comment.author.ipAddress = req.connection.remoteAddress;

    // Update request properties.
    req.akismet = {client, comment};
    next();
  }

  /**
   * Registers the middleware.
   * @private
   */
  _registerMiddleware() {
    this._express.use(cors({
      allowedHeaders: [HTTPHeaders.X_REQUESTED_WITH, HTTPHeaders.X_USER_AGENT],
      exposedHeaders: [HTTPHeaders.X_AKISMET_DEBUG_HELP],
      methods: ['GET', 'POST'],
      origin: '*'
    }));

    this._express.use(bodyParser.urlencoded({extended: true}));
    this._express.use(Server._processRequest);
  }

  /**
   * Registers the route table.
   * @private
   */
  _registerRoutes() {
    this._express.post(EndPoints.CHECK_COMMENT, this.checkComment.bind(this));
    this._express.post(EndPoints.SUBMIT_HAM, this.submitHam.bind(this));
    this._express.post(EndPoints.SUBMIT_SPAM, this.submitSpam.bind(this));
    this._express.post(EndPoints.VERIFY_KEY, this.verifyKey.bind(this));

    this._express.all('*', (req, res) => {
      if(req.method == 'OPTIONS')
        res.status(204).end();
      else {
        let redirect = this.redirectURL;
        if(typeof redirect == 'string') res.redirect(301, url.resolve(redirect, req.url));
        else res.status(404).send(http.STATUS_CODES[404]);
      }
    });
  }

  /**
   * Sends the specified response body.
   * @param {express.Response} res The response sent by the server.
   * @param {string} body The response body to send to the client.
   * @param {Error} [error] An error message to add to the response headers as `HTTPHeaders.X_AKISMET_DEBUG_HELP`.
   * @private
   */
  static _sendResponse(res, body, error) {
    res.type('text/plain; charset=utf-8');
    if(typeof error != 'undefined') res.set(HTTPHeaders.X_AKISMET_DEBUG_HELP, error.toString());
    res.send(body);
  }
}

// Public interface.
module.exports = Server;
