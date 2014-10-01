/**
 * Provides classes describing a comment and its author.
 * @module comment
 */
'use strict';

/**
 * Specifies the type of a comment.
 * @class akismet.CommentType
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

/**
 * Represents the author of a comment.
 * @class akismet.Author
 * @constructor
 * @param {Object} [options] An object specifying values used to initialize this instance.
 */
function Author(options) {

  /**
   * The author's mail address.
   * @property email
   * @type String
   */
  this.email=null;

  /**
   * The author's IP address.
   * @property ipAddress
   * @type String
   */
  this.ipAddress=null;

  /**
   * The author's name.
   * @property name
   * @type String
   */
  this.name=null;

  /**
   * The URL of the author's website.
   * @property url
   * @type String
   */
  this.url=null;

  /**
   * The author's user agent, that is the string identifying the Web browser used to submit comments.
   * @property userAgent
   * @type String
   */
  this.userAgent=null;

  // Initialize the instance.
  if(typeof options=='object' && options) {
    for(var key in options) {
      var option=options[key];
      if(this.hasOwnProperty(key) && typeof option!='undefined') this[key]=option;
    }
  }
}

/**
 * Creates a new author from the specified JSON string.
 * @method fromJSON
 * @param {Object|String} json A JSON string, or an already parsed object, representing an author.
 * @return {akismet.Author} The instance corresponding to the specified JSON object, or `null` if a parsing error occurred.
 * @static
 */
Author.fromJSON=function(json) {
  var map;
  if(typeof json!='string') map=json;
  else {
    try { map=JSON.parse(json); }
    catch(e) { return null; }
  }

  return !map || typeof map!='object' ? null : new Author({
    name: map.comment_author,
    email: map.comment_author_email,
    url: map.comment_author_url,
    userAgent: map.user_agent,
    ipAddress: map.user_ip
  });
};

/**
 * Converts this object to a string in JSON format.
 * @method toJSON
 * @param {Number|String} [space] Causes the resulting string to be pretty-printed.
 * @return {String} The JSON representation of this object.
 */
Author.prototype.toJSON=function(space) {
  var map={};
  if(typeof this.name=='string') map.comment_author=this.name;
  if(typeof this.email=='string') map.comment_author_email=this.email;
  if(typeof this.url=='string') map.comment_author_url=this.url;
  if(typeof this.userAgent=='string') map.user_agent=this.userAgent;
  if(typeof this.ipAddress=='string') map.user_ip=this.ipAddress;
  return JSON.stringify(map, null, space);
};

/**
 * Returns a string representation of this object.
 * @method toString
 * @return {String} The string representation of this object.
 */
Author.prototype.toString=function() {
  return 'Author '+this.toJSON(2);
};

/**
 * Represents a comment submitted by an author.
 * @class akismet.Comment
 * @constructor
 * @param {Object} [options] An object specifying values used to initialize this instance.
 */
function Comment(options) {

  /**
   * The comment's author.
   * @property author
   * @type akismet.Author
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
   * This string value specifies a `akismet.CommentType` constant or a made up value like `"registration"`.
   * @property type
   * @type String
   */
  this.type=null;

  // Initialize the instance.
  if(typeof options=='object' && options) {
    for(var key in options) {
      var option=options[key];
      if(this.hasOwnProperty(key) && typeof option!='undefined') this[key]=option;
    }
  }
}

/**
 * Creates a new comment from the specified JSON string.
 * @method fromJSON
 * @param {Object|String} json A JSON string, or an already parsed object, representing a comment.
 * @return {akismet.Comment} The instance corresponding to the specified JSON object, or `null` if a parsing error occurred.
 * @static
 */
Comment.fromJSON=function(json) {
  var map;
  if(typeof json!='string') map=json;
  else {
    try { map=JSON.parse(json); }
    catch(e) { return null; }
  }

  if(!map || typeof map!='object') return null;

  var hasAuthor=false;
  for(var key in map) {
    if(key.substr(0, 'comment_author'.length)=='comment_author' || key.substr(0, 'user'.length)=='user') {
      hasAuthor=true;
      break;
    }
  }

  return new Comment({
    author: hasAuthor ? Author.fromJSON(map) : null,
    content: map.comment_content,
    type: map.comment_type,
    permalink: map.permalink,
    referrer: map.referrer
  });
};

/**
 * Converts this object to a string in JSON format.
 * @method toJSON
 * @param {Number|String} [space] Causes the resulting string to be pretty-printed.
 * @return {String} The JSON representation of this object.
 */
Comment.prototype.toJSON=function(space) {
  var map={};
  if(this.author instanceof Author) {
    var fields=JSON.parse(this.author.toJSON());
    for(var key in fields) map[key]=fields[key];
  }

  if(typeof this.content=='string') map.comment_content=this.content;
  if(typeof this.type=='string') map.comment_type=this.type;
  if(typeof this.permalink=='string') map.permalink=this.permalink;
  if(typeof this.referrer=='string') map.referrer=this.referrer;
  return JSON.stringify(map, null, space);
};

/**
 * Returns a string representation of this object.
 * @method toString
 * @return {String} The string representation of this object.
 */
Comment.prototype.toString=function() {
  return 'Comment '+this.toJSON(2);
};

// Public interface.
module.exports={
  Author: Author,
  Comment: Comment,
  CommentType: CommentType
};
