/**
 * Contains enumerations that define commonly-used values.
 * @module enums
 */
'use strict';

/**
 * Provides the URLs corresponding to the service end points.
 */
const EndPoints=Object.freeze({

  /**
   * The URL of the [comment check](https://akismet.com/development/api/#comment-check) end point.
   * @var {string}
   * @readonly
   */
  CHECK_COMMENT: '/1.1/comment-check',

  /**
   * The URL of the [submit ham](https://akismet.com/development/api/#submit-ham) end point.
   * @var {string}
   * @readonly
   */
  SUBMIT_HAM: '/1.1/submit-ham',

  /**
   * The URL of the [submit spam](https://akismet.com/development/api/#submit-spam) end point.
   * @var {string}
   * @readonly
   */
  SUBMIT_SPAM: '/1.1/submit-spam',

  /**
   * The URL of the [key verification](https://akismet.com/development/api/#verify-key) end point.
   * @var {string}
   * @readonly
   */
  VERIFY_KEY: '/1.1/verify-key'
});

/**
 * A collection of custom HTTP headers and their values.
 */
const HTTPHeaders=Object.freeze({

  /**
   * Header corresponding to [Akismet](https://akismet.com) debug messages.
   * @var {string}
   * @readonly
   */
  X_AKISMET_DEBUG_HELP: 'x-akismet-debug-help',

  /**
   * Header used to identify an AJAX request.
   * @var {string}
   * @readonly
   */
  X_REQUESTED_WITH: 'x-requested-with',

  /**
   * Custom header corresponding to the user agent string sent by AJAX clients.
   * @var {string}
   * @readonly
   */
  X_USER_AGENT: 'x-user-agent'
});

// Public interface.
module.exports={
  EndPoints,
  HTTPHeaders
};
