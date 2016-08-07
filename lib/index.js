/**
 * Package entry point.
 * @module index
 */
const {Client} = require('./client');
const {Author, Blog, Comment, CommentType} = require('./core');

// Public interface.
module.exports = {
  Author,
  Blog,
  Client,
  Comment,
  CommentType
};

// Expose the `cedx.akismet` global property in browsers.
if(typeof window != 'undefined') {
  if(typeof window.cedx != 'object' || !window.cedx) window.cedx = {};
  window.cedx.akismet = module.exports;
}