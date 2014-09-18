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
  Blog: client.Blog,
  Client: client.Client,
  Comment: comment.Comment,
  CommentType: comment.CommentType,
  Server: typeof window!='undefined' ? null : require('./lib/server')
};
