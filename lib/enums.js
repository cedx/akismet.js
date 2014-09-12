/**
 * Contains enumerations that define commonly-used values.
 * @module enums
 */
'use strict';

/**
 * Provides the URLs corresponding to the service end points.
 * @class akismet.EndPoints
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
 * A collection of custom HTTP headers and their values.
 * @class akismet.HTTPHeaders
 * @static
 */
var HTTPHeaders={

  /**
   * Header corresponding to [Akismet](https://akismet.com) debug messages.
   * @property X_AKISMET_DEBUG_HELP
   * @type String
   * @static
   * @final
   */
  X_AKISMET_DEBUG_HELP: 'x-akismet-debug-help',

  /**
   * Header used to identify an AJAX request.
   * @property X_REQUESTED_WITH
   * @type String
   * @static
   * @final
   */
  X_REQUESTED_WITH: 'x-requested-with',

  /**
   * Custom header corresponding to the user agent string sent by AJAX clients.
   * @property X_USER_AGENT
   * @type String
   * @static
   * @final
   */
  X_USER_AGENT: 'x-user-agent'
};

// Public interface.
module.exports={
  EndPoints: EndPoints,
  HTTPHeaders: HTTPHeaders
};
