'use strict';

/**
 * Specifies the type of a comment.
 * @type {object}
 *
 * @property {string} comment A standard comment.
 * @property {string} pingback A [pingback](https://en.wikipedia.org/wiki/Pingback) comment.
 * @property {string} trackback A [trackback](https://en.wikipedia.org/wiki/Trackback) comment.
 */
exports.CommentType = Object.freeze({
  comment: 'comment',
  pingback: 'pingback',
  trackback: 'trackback'
});
