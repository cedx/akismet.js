/**
 * Package entry point.
 * @module index
 */
'use strict';

// Module dependencies.
const client = require('./lib/client');
const comment = require('./lib/comment');

// Public interface.
const akismet = {
  Author: comment.Author,
  Blog: client.Blog,
  Client: client.Client,
  Comment: comment.Comment,
  CommentType: comment.CommentType
};

module.exports = akismet;
if(typeof window != 'undefined') window.akismet = akismet;
