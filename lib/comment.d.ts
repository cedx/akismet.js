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
	context: Array<string>;

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
	constructor(options?: CommentOptions);

	/**
	 * Creates a new comment from the specified JSON object.
	 * @param json A JSON object representing a comment.
	 * @returns The instance corresponding to the specified JSON object.
	 */
	static fromJson(json: Record<string, any>): Comment;

	/**
	 * Returns a JSON representation of this object.
	 * @returns The JSON representation of this object.
	 */
	toJSON(): Record<string, any>;
}

/**
 * Defines the options of a {@link Comment} instance.
 */
export type CommentOptions = Partial<{

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
	context: Array<string>;

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
	type: string;
}>;

/**
 * Specifies the type of a comment.
 */
export const CommentType: Readonly<{

	/**
	 * A blog post.
	 */
	blogPost: "blog-post",

	/**
	 * A blog comment.
	 */
	comment: "comment",

	/**
	 * A contact form or feedback form submission.
	 */
	contactForm: "contact-form",

	/**
	 * A top-level forum post.
	 */
	forumPost: "forum-post",

	/**
	 * A message sent between just a few users.
	 */
	message: "message",

	/**
	 * A reply to a top-level forum post.
	 */
	reply: "reply",

	/**
	 * A new user account.
	 */
	signup: "signup"
}>;

/**
 * Specifies the type of a comment.
 */
export type CommentType = typeof CommentType[keyof typeof CommentType];
