import { Author } from './author.js';
/** Represents a comment submitted by an author. */
export class Comment {
    /**
     * Creates a new comment.
     * @param author The comment's author.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(author, options = {}) {
        this.author = author;
        const { content = '', date, permalink, postModified, recheckReason = '', referrer, type = '' } = options;
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
     * @param map A JSON object representing a comment.
     * @return The instance corresponding to the specified JSON object.
     */
    static fromJson(map) {
        const hasAuthor = Object.keys(map).filter(key => key.startsWith('comment_author') || key.startsWith('user')).length > 0;
        return new Comment(hasAuthor ? Author.fromJson(map) : undefined, {
            content: typeof map.comment_content == 'string' ? map.comment_content : '',
            date: typeof map.comment_date_gmt == 'string' ? new Date(map.comment_date_gmt) : undefined,
            permalink: typeof map.permalink == 'string' ? new URL(map.permalink) : undefined,
            postModified: typeof map.comment_post_modified_gmt == 'string' ? new Date(map.comment_post_modified_gmt) : undefined,
            recheckReason: typeof map.recheck_reason == 'string' ? map.recheck_reason : '',
            referrer: typeof map.referrer == 'string' ? new URL(map.referrer) : undefined,
            type: typeof map.comment_type == 'string' ? map.comment_type : ''
        });
    }
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON() {
        const map = this.author ? this.author.toJSON() : {};
        if (this.content.length)
            map.comment_content = this.content;
        if (this.date)
            map.comment_date_gmt = this.date.toJSON();
        if (this.permalink)
            map.permalink = this.permalink.href;
        if (this.postModified)
            map.comment_post_modified_gmt = this.postModified.toJSON();
        if (this.recheckReason.length)
            map.recheck_reason = this.recheckReason;
        if (this.referrer)
            map.referrer = this.referrer.href;
        if (this.type.length)
            map.comment_type = this.type;
        return map;
    }
}
/** Specifies the type of a comment. */
export var CommentType;
(function (CommentType) {
    /** A blog post. */
    CommentType["blogPost"] = "blog-post";
    /** A blog comment. */
    CommentType["comment"] = "comment";
    /** A contact form or feedback form submission. */
    CommentType["contactForm"] = "contact-form";
    /** A top-level forum post. */
    CommentType["forumPost"] = "forum-post";
    /** A [pingback](https://en.wikipedia.org/wiki/Pingback) post. */
    CommentType["pingback"] = "pingback";
    /** A [trackback](https://en.wikipedia.org/wiki/Trackback) post. */
    CommentType["trackback"] = "trackback";
    /** A [Twitter](https://twitter.com) message. */
    CommentType["tweet"] = "tweet";
})(CommentType || (CommentType = {}));
