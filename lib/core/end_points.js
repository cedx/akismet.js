/**
 * Implementation of the `akismet.EndPoints` enumeration.
 * @module core/end_points
 */

/**
 * Provides the URLs corresponding to the service end points.
 * @enum {string}
 */
const EndPoints = {

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
};

// Public interface.
module.exports = Object.freeze(EndPoints);
