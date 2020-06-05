import { Author } from "./author.js";
import { JsonObject } from "./json.js";
/** Represents a comment submitted by an author. */
export declare class Comment {
    author?: Author | undefined;
    /** The comment's content. */
    content: string;
    /** The UTC timestamp of the creation of the comment. */
    date?: Date;
    /** The permanent location of the entry the comment is submitted to. */
    permalink?: URL;
    /** The UTC timestamp of the publication time for the post, page or thread on which the comment was posted. */
    postModified?: Date;
    /** A string describing why the content is being rechecked. */
    recheckReason: string;
    /** The URL of the webpage that linked to the entry being requested. */
    referrer?: URL;
    /** The comment's type. */
    type: string;
    /**
     * Creates a new comment.
     * @param author The comment's author.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(author?: Author | undefined, options?: Partial<CommentOptions>);
    /**
     * Creates a new comment from the specified JSON object.
     * @param map A JSON object representing a comment.
     * @return The instance corresponding to the specified JSON object.
     */
    static fromJson(map: JsonObject): Comment;
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON(): JsonObject;
}
/** Defines the options of a [[Comment]] instance. */
export interface CommentOptions {
    /** The comment's content. */
    content: string;
    /** The UTC timestamp of the creation of the comment. */
    date: Date;
    /** The permanent location of the entry the comment is submitted to. */
    permalink: URL;
    /** The UTC timestamp of the publication time for the post, page or thread on which the comment was posted. */
    postModified: Date;
    /** A string describing why the content is being rechecked. */
    recheckReason: string;
    /** The URL of the webpage that linked to the entry being requested. */
    referrer: URL;
    /** The comment's type. */
    type: string;
}
/** Specifies the type of a comment. */
export declare enum CommentType {
    /** A blog post. */
    blogPost = "blog-post",
    /** A blog comment. */
    comment = "comment",
    /** A contact form or feedback form submission. */
    contactForm = "contact-form",
    /** A top-level forum post. */
    forumPost = "forum-post",
    /** A [pingback](https://en.wikipedia.org/wiki/Pingback) post. */
    pingback = "pingback",
    /** A [trackback](https://en.wikipedia.org/wiki/Trackback) post. */
    trackback = "trackback",
    /** A [Twitter](https://twitter.com) message. */
    tweet = "tweet"
}
