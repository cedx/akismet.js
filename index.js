/**
 * Package entry point.
 * @module index
 */
'use strict';

// Module dependencies.
var comment=require('./lib/comment');

// Public interface.
module.exports={
  Author: comment.Author,
  Client: require('./lib/client'),
  Comment: comment.Comment,
  CommentType: comment.CommentType
};
