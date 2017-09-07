'use strict';

/**
 * Specifies the type of a comment.
 * @type {object}
 *
 * @property {string} COMMENT A standard comment.
 * @property {string} PINGBACK A [pingback](https://en.wikipedia.org/wiki/Pingback) comment.
 * @property {string} TRACKBACK A [trackback](https://en.wikipedia.org/wiki/Trackback) comment.
 */
exports.CommentType = Object.freeze({
  COMMENT: 'comment',
  PINGBACK: 'pingback',
  TRACKBACK: 'trackback'
});