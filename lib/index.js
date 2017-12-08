'use strict';

const {Author} = require('./author');
const {Blog} = require('./blog');
const {Client, RequestEvent} = require('./client');
const {Comment, CommentType} = require('./comment');

module.exports = {
  Author,
  Blog,
  Client,
  Comment,
  CommentType,
  RequestEvent
};
