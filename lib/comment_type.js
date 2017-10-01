'use strict';

/**
 * Specifies the type of a comment.
 * @type {object}
 *
 * @property {string} blogPost A blog post.
 * @property {string} comment A blog comment.
 * @property {string} contactForm A contact form or feedback form submission.
 * @property {string} forumPost A top-level forum post.
 * @property {string} message A message sent between just a few users.
 * @property {string} pingback A [pingback](https://en.wikipedia.org/wiki/Pingback) post.
 * @property {string} reply A reply to a top-level forum post.
 * @property {string} signup A new user account.
 * @property {string} trackback A [trackback](https://en.wikipedia.org/wiki/Trackback) post.
 * @property {string} tweet A [Twitter](https://twitter.com) message.
 */
exports.CommentType = Object.freeze({
  blogPost: 'blog-post',
  comment: 'comment',
  contactForm: 'contact-form',
  forumPost: 'forum-post',
  message: 'message',
  pingback: 'pingback',
  reply: 'reply',
  signup: 'signup',
  trackback: 'trackback',
  tweet: 'tweet'
});
