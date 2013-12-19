/**
 * Implementation of the `Author` class.
 * @module author
 */
'use strict';

/**
 * Represents the author of a `Comment`.
 * @class Author
 * @constructor
 * @param {Object} properties An object specifying values used to initialize this object.
 */
function Author(properties) {

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
  if(typeof properties=='object')
    for(var key in properties) {
      if(key in this && typeof properties[key]=='string') this[key]=properties[key];
    }
}

/**
 * Creates a new `Author` from the specified JSON string.
 * @method fromJSON
 * @param {Object|String} json A JSON string, or an already parsed object, representing an `Author`.
 * @return {Author} The instance corresponding to the specified JSON object, or `null` if a parsing error occurred.
 * @static
 */
Author.fromJSON=function(json) {
  var map;
  if(typeof json!='string') map=json;
  else {
    try { map=JSON.parse(json); }
    catch(e) { return null; }
  }

  return typeof map!='object' ? null : new Author({
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
 * @return {String} The JSON representation of this object.
 */
Author.prototype.toJSON=function() {
  var map={};
  if(typeof this.name=='string') map.comment_author=this.name;
  if(typeof this.email=='string') map.comment_author_email=this.email;
  if(typeof this.url=='string') map.comment_author_url=this.url;
  if(typeof this.userAgent=='string') map.user_agent=this.userAgent;
  if(typeof this.ipAddress=='string') map.user_ip=this.ipAddress;
  return JSON.stringify(map);
};

/**
 * Returns a string representation of this object.
 * @method toString
 * @return {String} The string representation of this object.
 */
Author.prototype.toString=function() {
  return 'Author '+this.toJSON();
};

// Public interface.
module.exports=Author;
