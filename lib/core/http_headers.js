/**
 * Implementation of the `HTTPHeaders` enumeration.
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
  X_AKISMET_DEBUG_HELP: 'x-akismet-debug-help',

  /**
   * Header used to identify an AJAX request.
   */
  X_REQUESTED_WITH: 'x-requested-with',

  /**
   * Custom header corresponding to the user agent string sent by AJAX clients.
   */
  X_USER_AGENT: 'x-user-agent'
};

module.exports = Object.freeze(HTTPHeaders);
