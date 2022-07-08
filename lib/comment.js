import {Author} from "./author.js";

/**
 * Represents a comment submitted by an author.
 */
export class Comment {

	/**
	 * The comment's author.
	 * @type {Author|null}
	 */
	author;

	/**
	 * The comment's content.
	 * @type {string}
	 */
	content;

	/**
	 * The UTC timestamp of the creation of the comment.
	 * @type {Date|null}
	 */
	date;

	/**
	 * The permanent location of the entry the comment is submitted to.
	 * @type {URL|null}
	 */
	permalink;

	/**
	 * The UTC timestamp of the publication time for the post, page or thread on which the comment was posted.
	 * @type {Date|null}
	 */
	postModified;

	/**
	 * A string describing why the content is being rechecked.
	 * @type {string}
	 */
	recheckReason;

	/**
	 * The URL of the webpage that linked to the entry being requested.
	 * @type {URL|null}
	 */
	referrer;

	/**
	 * The comment's type.
	 * @type {CommentType}
	 */
	type;

	/**
	 * Creates a new comment.
	 * @param {Partial<CommentOptions>} [options] An object providing values to initialize this instance.
	 */
	constructor(options = {}) {
		this.author = options.author ?? null;
		this.content = options.content ?? "";
		this.date = options.date ?? null;
		this.permalink = options.permalink ? new URL(options.permalink) : null;
		this.postModified = options.postModified ?? null;
		this.recheckReason = options.recheckReason ?? "";
		this.referrer = options.referrer ? new URL(options.referrer) : null;
		this.type = options.type ?? "";
	}

	/**
	 * Creates a new comment from the specified JSON object.
	 * @param {Record<string, any>} json A JSON object representing a comment.
	 * @returns {Comment} The instance corresponding to the specified JSON object.
	 */
	static fromJson(json) {
		const hasAuthor = Object.keys(json).filter(key => key.startsWith("comment_author") || key.startsWith("user")).length > 0;
		return new this({
			author: hasAuthor ? Author.fromJson(json) : null,
			content: typeof json.comment_content == "string" ? json.comment_content : "",
			date: typeof json.comment_date_gmt == "string" ? new Date(json.comment_date_gmt) : null,
			permalink: typeof json.permalink == "string" ? json.permalink : "",
			postModified: typeof json.comment_post_modified_gmt == "string" ? new Date(json.comment_post_modified_gmt) : null,
			recheckReason: typeof json.recheck_reason == "string" ? json.recheck_reason : "",
			referrer: typeof json.referrer == "string" ? json.referrer : "",
			type: typeof json.comment_type == "string" ? json.comment_type : ""
		});
	}

	/**
	 * Converts this object to a map in JSON format.
	 * @returns {Record<string, any>} The map in JSON format corresponding to this object.
	 */
	toJSON() {
		const map = this.author ? this.author.toJSON() : {};
		if (this.content) map.comment_content = this.content;
		if (this.date) map.comment_date_gmt = this.date.toJSON();
		if (this.permalink) map.permalink = this.permalink.href;
		if (this.postModified) map.comment_post_modified_gmt = this.postModified.toJSON();
		if (this.recheckReason) map.recheck_reason = this.recheckReason;
		if (this.referrer) map.referrer = this.referrer.href;
		if (this.type) map.comment_type = this.type;
		return map;
	}
}

/**
 * Defines the options of a {@link Comment} instance.
 * @typedef {object} CommentOptions
 * @property {Author|null} author The comment's author.
 * @property {string} content The comment's content.
 * @property {Date|null} date The UTC timestamp of the creation of the comment.
 * @property {string} permalink The permanent location of the entry the comment is submitted to.
 * @property {Date|null} postModified The UTC timestamp of the publication time for the post, page or thread on which the comment was posted.
 * @property {string} recheckReason A string describing why the content is being rechecked.
 * @property {string} referrer The URL of the webpage that linked to the entry being requested.
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
