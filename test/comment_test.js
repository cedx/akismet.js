import {equal, ok} from "node:assert/strict";
import {describe, it} from "node:test";
import {Author, Comment, CommentType} from "@cedx/akismet";

/**
 * Tests the features of the {@link Comment} class.
 */
describe("Comment", () => {
	describe("fromJson()", () => {
		it("should return an empty instance with an empty map", () => {
			const comment = Comment.fromJson({});
			equal(comment.author, null);
			equal(comment.content.length, 0);
			equal(comment.date, null);
			equal(comment.permalink, null);
			equal(comment.postModified, null);
			equal(comment.recheckReason.length, 0);
			equal(comment.referrer, null);
			equal(comment.type.length, 0);
		});

		it("should return an initialized instance with a non-empty map", () => {
			const comment = Comment.fromJson({
				comment_author: "Cédric Belin",
				comment_content: "A user comment.",
				comment_date_gmt: "2000-01-01T00:00:00.000Z",
				comment_type: "blog-post",
				referrer: "https://belin.io",
				recheck_reason: "The comment has been changed.",
				user_ip: "127.0.0.1"
			});

			ok(comment.author instanceof Author);
			equal(comment.author.ipAddress, "127.0.0.1");
			equal(comment.author.name, "Cédric Belin");
			equal(comment.content, "A user comment.");
			ok(comment.date instanceof Date);
			equal(comment.date.toISOString(), "2000-01-01T00:00:00.000Z");
			ok(comment.referrer instanceof URL);
			equal(comment.recheckReason, "The comment has been changed.");
			equal(comment.referrer.href, "https://belin.io/");
			equal(comment.type, CommentType.blogPost);
		});
	});

	describe("toJSON()", () => {
		it("should return only the author info with a newly created instance", () => {
			const json = new Comment({author: new Author({ipAddress: "127.0.0.1"})}).toJSON();
			equal(Object.keys(json).length, 1);
			equal(json.user_ip, "127.0.0.1");
		});

		it("should return a non-empty map with an initialized instance", () => {
			const json = new Comment({
				author: new Author({ipAddress: "127.0.0.1", name: "Cédric Belin", userAgent: "Doom/6.6.6"}),
				content: "A user comment.",
				date: new Date("2000-01-01T00:00:00.000Z"),
				referrer: "https://belin.io",
				type: CommentType.blogPost
			}).toJSON();

			equal(Object.keys(json).length, 7);
			equal(json.comment_author, "Cédric Belin");
			equal(json.comment_content, "A user comment.");
			equal(json.comment_date_gmt, "2000-01-01T00:00:00.000Z");
			equal(json.comment_type, "blog-post");
			equal(json.referrer, "https://belin.io/");
			equal(json.user_agent, "Doom/6.6.6");
			equal(json.user_ip, "127.0.0.1");
		});
	});
});
