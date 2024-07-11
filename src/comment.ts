import {Author} from "./author.js";

/**
 * Represents a comment submitted by an author.
 */
export class Comment {

	/**
	 * The comment's author.
	 */
	author: Author|null;

	/**
	 * The comment's content.
	 */
	content: string;

	/**
	 * The context in which this comment was posted.
	 */
	context: string[];

	/**
	 * The UTC timestamp of the creation of the comment.
	 */
	date: Date|null;

	/**
	 * The permanent location of the entry the comment is submitted to.
	 */
	permalink: URL|null;

	/**
	 * The UTC timestamp of the publication time for the post, page or thread on which the comment was posted.
	 */
	postModified: Date|null;

	/**
	 * A string describing why the content is being rechecked.
	 */
	recheckReason: string;

	/**
	 * The URL of the webpage that linked to the entry being requested.
	 */
	referrer: URL|null;

	/**
	 * The comment's type.
	 */
	type: CommentType|string;

	/**
	 * Creates a new comment.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options: Partial<CommentOptions> = {}) {
		this.author = options.author ?? null;
		this.content = options.content ?? "";
		this.context = options.context ?? [];
		this.date = options.date ?? null;
		this.permalink = options.permalink ? new URL(options.permalink) : null;
		this.postModified = options.postModified ?? null;
		this.recheckReason = options.recheckReason ?? "";
		this.referrer = options.referrer ? new URL(options.referrer) : null;
		this.type = options.type ?? "";
	}

	/**
	 * Creates a new comment from the specified JSON object.
	 * @param json A JSON object representing a comment.
	 * @returns The instance corresponding to the specified JSON object.
	 */
	static fromJson(json: Record<string, any>): Comment {
		const hasAuthor = Object.keys(json).filter(key => key.startsWith("comment_author") || key.startsWith("user")).length > 0;
		return new this({
			author: hasAuthor ? Author.fromJson(json) : null,
			content: typeof json.comment_content == "string" ? json.comment_content : "",
			context: Array.isArray(json.comment_context) ? json.comment_context : [],
			date: typeof json.comment_date_gmt == "string" ? new Date(json.comment_date_gmt) : null,
			permalink: typeof json.permalink == "string" ? json.permalink : "",
			postModified: typeof json.comment_post_modified_gmt == "string" ? new Date(json.comment_post_modified_gmt) : null,
			recheckReason: typeof json.recheck_reason == "string" ? json.recheck_reason : "",
			referrer: typeof json.referrer == "string" ? json.referrer : "",
			type: typeof json.comment_type == "string" ? json.comment_type : ""
		});
	}

	/**
	 * Returns a JSON representation of this object.
	 * @returns The JSON representation of this object.
	 */
	toJSON(): Record<string, any> {
		const map = this.author ? this.author.toJSON() : {};
		if (this.content) map.comment_content = this.content;
		if (this.context.length) map.comment_context = this.context;
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
 */
export interface CommentOptions {

	/**
	 * The comment's author.
	 */
	author: Author|null;

	/**
	 * The comment's content.
	 */
	content: string;

	/**
	 * The context in which this comment was posted.
	 */
	context: string[];

	/**
	 * The UTC timestamp of the creation of the comment.
	 */
	date: Date|null;

	/**
	 * The permanent location of the entry the comment is submitted to.
	 */
	permalink: URL|string;

	/**
	 * The UTC timestamp of the publication time for the post, page or thread on which the comment was posted.
	 */
	postModified: Date|null;

	/**
	 * A string describing why the content is being rechecked.
	 */
	recheckReason: string;

	/**
	 * The URL of the webpage that linked to the entry being requested.
	 */
	referrer: URL|string;

	/**
	 * The comment's type.
	 */
	type: CommentType|string;
}

/**
 * Specifies the type of a comment.
 */
export enum CommentType {

	/**
	 * A blog post.
	 */
	blogPost = "blog-post",

	/**
	 * A blog comment.
	 */
	comment = "comment",

	/**
	 * A contact form or feedback form submission.
	 */
	contactForm = "contact-form",

	/**
	 * A top-level forum post.
	 */
	forumPost = "forum-post",

	/**
	 * A message sent between just a few users.
	 */
	message = "message",

	/**
	 * A reply to a top-level forum post.
	 */
	reply = "reply",

	/**
	 * A new user account.
	 */
	signup = "signup"
}
