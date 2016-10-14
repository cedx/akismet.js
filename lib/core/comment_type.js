/**
 * Implementation of the `CommentType` enumeration.
 * @module core/comment_type
 */

/**
 * Specifies the type of a comment.
 * @enum {string}
 */
const CommentType = {

  /**
   * A standard comment.
   */
  COMMENT: 'comment',

  /**
   * A [pingback](https://en.wikipedia.org/wiki/Pingback) comment.
   */
  PINGBACK: 'pingback',

  /**
   * A [trackback](https://en.wikipedia.org/wiki/Trackback) comment.
   */
  TRACKBACK: 'trackback'
};

module.exports = Object.freeze(CommentType);
