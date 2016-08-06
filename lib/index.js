/**
 * Package entry point.
 * @module index
 */
const {Client} = require('./client');
const {Author, Blog, Comment, CommentType} = require('./core');

// Public interface.
const akismet = {
  Author,
  Blog,
  Client,
  Comment,
  CommentType
};

module.exports = akismet;
if(typeof window != 'undefined') window.akismet = akismet;
