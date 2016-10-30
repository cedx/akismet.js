/**
 * Provides the URLs corresponding to the service end points.
 * @type {object}
 *
 * @property {string} CHECK_COMMENT The URL of the [comment check](https://akismet.com/development/api/#comment-check) end point.
 * @property {string} SUBMIT_HAM The URL of the [submit ham](https://akismet.com/development/api/#submit-ham) end point.
 * @property {string} SUBMIT_SPAM The URL of the [submit spam](https://akismet.com/development/api/#submit-spam) end point.
 * @property {string} VERIFY_KEY The URL of the [key verification](https://akismet.com/development/api/#verify-key) end point.
 */
export const EndPoints = Object.freeze({
  CHECK_COMMENT: '/1.1/comment-check',
  SUBMIT_HAM: '/1.1/submit-ham',
  SUBMIT_SPAM: '/1.1/submit-spam',
  VERIFY_KEY: '/1.1/verify-key'
});
