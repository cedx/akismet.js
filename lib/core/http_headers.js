/**
 * Implementation of the `akismet.HTTPHeaders` enumeration.
 * @module core/http_headers
 */

/**
 * A collection of custom HTTP headers and their values.
 * @enum {string}
 */
const HTTPHeaders = {

  /**
   * Header corresponding to [Akismet](https://akismet.com) debug messages.
   */
  X_AKISMET_DEBUG_HELP: 'X-Akismet-Debug-Help',

  /**
   * Header used to identify an AJAX request.
   */
  X_REQUESTED_WITH: 'X-Requested-With',

  /**
   * Custom header corresponding to the user agent string sent by AJAX clients.
   */
  X_USER_AGENT: 'X-User-Agent'
};

module.exports = Object.freeze(HTTPHeaders);
