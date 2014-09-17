/**
 * Package entry point.
 * @module index
 */
'use strict';

// Module dependencies.
var core=require('./lib/comment');

// Public interface.
module.exports={
  Author: core.Author,
  Client: require('./lib/client'),
  Comment: core.Comment,
  CommentType: core.CommentType,
  Server: typeof window!='undefined' ? null : require('./lib/server')
};
