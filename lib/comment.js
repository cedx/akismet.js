/**
 * Implementation of the `Comment` and `CommentType` classes.
 * @module comment
 */
'use strict';

// Module dependencies.
var Author=require('./author');

/**
 * Represents a comment submitted by an `Author`.
 * @class Comment
 * @constructor
 * @param {Object} properties An object specifying values used to initialize this object.
 */
function Comment() {

  /**
   * The comment's author.
   * @property author
   * @type Author
   */
  this.author=null;

  /**
   * The comment's content.
   * @property content
   * @type String
   */
  this.content=null;

  /**
   * The permanent location of the entry the comment is submitted to.
   * @property permalink
   * @type String
   */
  this.permalink=null;

  /**
   * The URL of the webpage that linked to the entry being requested.
   * @property referrer
   * @type String
   */
  this.referrer=null;

  /**
   * The comment's type.
   * This string value specifies a `CommentType` constant or a made up value like "registration".
   * @property type
   * @type String
   */
  this.type=null;
}

/**
 * Creates a new `Comment` from the specified JSON string.
 * @method fromJSON
 * @param {Object|String} json A JSON string, or an already parsed object, representing an `Comment`.
 * @return {Comment} The instance corresponding to the specified JSON object, or `null` if a parsing error occurred.
 * @static
 */
Comment.fromJSON=function(json) {
  var map;
  if(typeof json!='string') map=json;
  else {
    try { map=JSON.parse(json); }
    catch(e) { return null; }
  }

  return typeof map!='object' ? null : new Comment({
    author: Author.fromJSON(map.author),
    content: map.comment_content,
    type: map.comment_type,
    permalink: map.permalink,
    referrer: map.referrer
  });
};

/**
 * Converts this object to a string in JSON format.
 * @method toJSON
 * @return {String} The JSON representation of this object.
 */
Comment.prototype.toJSON=function() {
  var map={};
  if(this.author instanceof Author) {
    var fields=JSON.parse(this.author.toJSON());
    for(var key in fields) map[key]=fields[key];
  }

  if(typeof this.content=='string') map.comment_content=this.content;
  if(typeof this.type=='string') map.comment_type=this.type;
  if(typeof this.permalink=='string') map.permalink=this.permalink;
  if(typeof this.referrer=='string') map.referrer=this.referrer;
  return JSON.stringify(map);
};

/**
 * Returns a string representation of this object.
 * @method toString
 * @return {String} The string representation of this object.
 */
Comment.prototype.toString=function() {
  return 'Comment '+this.toJSON();
};

/**
 * Specifies the type of a `Comment`.
 * @class CommentType
 * @static
 */
var CommentType={

  /**
   * A standard comment.
   * @property COMMENT
   * @type String
   * @static
   * @final
   */
  COMMENT: 'comment',

  /**
   * A [pingback](https://en.wikipedia.org/wiki/Pingback) comment.
   * @property PINGBACK
   * @type String
   * @static
   * @final
   */
  PINGBACK: 'pingback',

  /**
   * A [trackback](https://en.wikipedia.org/wiki/Trackback) comment.
   * @property TRACKBACK
   * @type String
   * @static
   * @final
   */
  TRACKBACK: 'trackback'
};

// Public interface.
module.exports={
  Comment: Comment,
  CommentType: CommentType
};
