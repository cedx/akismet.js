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
if(typeof global.window != 'undefined') {
  if(typeof global.window.cedx != 'object' || !global.window.cedx) global.window.cedx = {};
  global.window.cedx.akismet = module.exports;
}
