/**
 * Package entry point.
 * @module index
 */
'use strict';

// Module dependencies.
var client=require('./lib/client');
var comment=require('./lib/comment');

// Public interface.
module.exports={
  Author: comment.Author,
  Client: client.Client,
  Comment: comment.Comment,
  CommentType: comment.CommentType
};
