/**
 * Contains enumerations that define commonly-used values.
 * @module enums
 */
'use strict';

/**
 * Provides the URLs corresponding to the service end points.
 * @enum {string}
 */
const EndPoints=Object.freeze({

  /**
   * The URL of the [comment check](https://akismet.com/development/api/#comment-check) end point.
   */
  CHECK_COMMENT: '/1.1/comment-check',

  /**
   * The URL of the [submit ham](https://akismet.com/development/api/#submit-ham) end point.
   */
  SUBMIT_HAM: '/1.1/submit-ham',

  /**
   * The URL of the [submit spam](https://akismet.com/development/api/#submit-spam) end point.
   */
  SUBMIT_SPAM: '/1.1/submit-spam',

  /**
   * The URL of the [key verification](https://akismet.com/development/api/#verify-key) end point.
   */
  VERIFY_KEY: '/1.1/verify-key'
});

/**
 * A collection of custom HTTP headers and their values.
 * @enum {string}
 */
const HTTPHeaders=Object.freeze({

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
});

// Public interface.
module.exports={
  EndPoints,
  HTTPHeaders
};
