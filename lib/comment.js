import {Author} from "./author.js";

/**
 * Represents a comment submitted by an author.
 */
export class Comment {

	/**
	 * Creates a new comment.
	 * @param author The comment's author.
	 * @param {Partial<CommentOptions>} [options] An object providing values to initialize this instance.
	 */
	constructor(author, options = {}) {
		this.author = author;
		const { content = "", date, permalink, postModified, recheckReason = "", referrer, type = "" } = options;
		this.content = content;
		this.date = date;
		this.permalink = permalink;
		this.postModified = postModified;
		this.recheckReason = recheckReason;
		this.referrer = referrer;
		this.type = type;
	}

	/**
	 * Creates a new comment from the specified JSON object.
	 * @param {Record<string, any>} map A JSON object representing a comment.
	 * @returns {Comment} The instance corresponding to the specified JSON object.
	 */
	static fromJson(map) {
		const hasAuthor = Object.keys(map).filter(key => key.startsWith("comment_author") || key.startsWith("user")).length > 0;
		return new this(hasAuthor ? Author.fromJson(map) : undefined, {
			content: typeof map.comment_content == "string" ? map.comment_content : "",
			date: typeof map.comment_date_gmt == "string" ? new Date(map.comment_date_gmt) : undefined,
			permalink: typeof map.permalink == "string" ? new URL(map.permalink) : undefined,
			postModified: typeof map.comment_post_modified_gmt == "string" ? new Date(map.comment_post_modified_gmt) : undefined,
			recheckReason: typeof map.recheck_reason == "string" ? map.recheck_reason : "",
			referrer: typeof map.referrer == "string" ? new URL(map.referrer) : undefined,
			type: typeof map.comment_type == "string" ? map.comment_type : ""
		});
	}

	/**
	 * Converts this object to a map in JSON format.
	 * @returns {Record<string, any>} The map in JSON format corresponding to this object.
	 */
	toJSON() {
		const map = this.author ? this.author.toJSON() : {};
		if (this.content.length) map.comment_content = this.content;
		if (this.date) map.comment_date_gmt = this.date.toJSON();
		if (this.permalink) map.permalink = this.permalink.href;
		if (this.postModified) map.comment_post_modified_gmt = this.postModified.toJSON();
		if (this.recheckReason.length) map.recheck_reason = this.recheckReason;
		if (this.referrer) map.referrer = this.referrer.href;
		if (this.type.length) map.comment_type = this.type;
		return map;
	}
}

/**
 * Defines the options of a {@link Comment} instance.
 * @typedef {object} CommentOptions
 * @property {string} content The comment's content.
 * @property {Date} date The UTC timestamp of the creation of the comment.
 * @property {string|null} permalink The permanent location of the entry the comment is submitted to.
 * @property {Date} postModified The UTC timestamp of the publication time for the post, page or thread on which the comment was posted.
 * @property {string} recheckReason A string describing why the content is being rechecked.
 * @property {string|null} referrer The URL of the webpage that linked to the entry being requested.
 * @property {string} type The comment's type.
 */

/**
 * Specifies the type of a comment.
 * @enum {string}
 */
export const CommentType = Object.freeze({

	/** A blog post. */
	blogPost: "blog-post",

	/** A blog comment. */
	comment: "comment",

	/** A contact form or feedback form submission. */
	contactForm: "contact-form",

	/** A top-level forum post. */
	forumPost: "forum-post",

	/** A message sent between just a few users. */
	message: "message",

	/** A reply to a top-level forum post. */
	reply: "reply",

	/** A new user account. */
	signup: "signup"
});
