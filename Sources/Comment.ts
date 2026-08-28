import type {Author} from "./Author.js";

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
	type: string;

	/**
	 * Creates a new comment.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options: CommentOptions = {}) {
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
	 * Returns a JSON representation of this object.
	 * @returns The JSON representation of this object.
	 */
	toJSON(): Record<string, any> {
		const map = this.author ? this.author.toJSON() : {};
		if (this.content) map.comment_content = this.content;
		// TODO if (this.context.length) map.comment_context = this.context;
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
 * Defines the options of an {@link Author} instance.
 */
export type CommentOptions = Partial<Omit<Comment, "permalink"|"referrer"|"toJSON"> & {

	/**
	 * The permanent location of the entry the comment is submitted to.
	 */
	permalink: URL|string;

	/**
	 * The URL of the webpage that linked to the entry being requested.
	 */
	referrer: URL|string;
}>;

/**
 * Specifies the type of a comment.
 */
export const CommentType = Object.freeze({

	/**
	 * A blog post.
	 */
	BlogPost: "blog-post",

	/**
	 * A blog comment.
	 */
	Comment: "comment",

	/**
	 * A contact form or feedback form submission.
	 */
	ContactForm: "contact-form",

	/**
	 * A top-level forum post.
	 */
	ForumPost: "forum-post",

	/**
	 * A message sent between just a few users.
	 */
	Message: "message",

	/**
	 * A reply to a top-level forum post.
	 */
	Reply: "reply",

	/**
	 * A new user account.
	 */
	Signup: "signup"
});

/**
 * Specifies the type of a comment.
 */
export type CommentType = typeof CommentType[keyof typeof CommentType];
