import assert from "node:assert/strict";
import {describe, it} from "node:test";
import {Author, Comment, CommentType} from "#akismet";

/**
 * Tests the features of the {@link Comment} class.
 */
describe("Comment", () => {
	describe("fromJson()", () => {
		it("should return an empty instance with an empty map", () => {
			const comment = Comment.fromJson({});
			assert.equal(comment.author, null);
			assert.equal(comment.content.length, 0);
			assert.equal(comment.date, null);
			assert.equal(comment.permalink, null);
			assert.equal(comment.postModified, null);
			assert.equal(comment.recheckReason.length, 0);
			assert.equal(comment.referrer, null);
			assert.equal(comment.type.length, 0);
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

			assert.ok(comment.author instanceof Author);
			assert.equal(comment.author.ipAddress, "127.0.0.1");
			assert.equal(comment.author.name, "Cédric Belin");
			assert.equal(comment.content, "A user comment.");
			assert.ok(comment.date instanceof Date);
			assert.equal(comment.date.toISOString(), "2000-01-01T00:00:00.000Z");
			assert.ok(comment.referrer instanceof URL);
			assert.equal(comment.recheckReason, "The comment has been changed.");
			assert.equal(comment.referrer.href, "https://belin.io/");
			assert.equal(comment.type, CommentType.blogPost);
		});
	});

	describe("toJSON()", () => {
		it("should return only the author info with a newly created instance", () => {
			const json = new Comment({author: new Author({ipAddress: "127.0.0.1"})}).toJSON();
			assert.equal(Object.keys(json).length, 1);
			assert.equal(json.user_ip, "127.0.0.1");
		});

		it("should return a non-empty map with an initialized instance", () => {
			const json = new Comment({
				author: new Author({ipAddress: "127.0.0.1", name: "Cédric Belin", userAgent: "Doom/6.6.6"}),
				content: "A user comment.",
				date: new Date("2000-01-01T00:00:00.000Z"),
				referrer: "https://belin.io",
				type: CommentType.blogPost
			}).toJSON();

			assert.equal(Object.keys(json).length, 7);
			assert.equal(json.comment_author, "Cédric Belin");
			assert.equal(json.comment_content, "A user comment.");
			assert.equal(json.comment_date_gmt, "2000-01-01T00:00:00.000Z");
			assert.equal(json.comment_type, "blog-post");
			assert.equal(json.referrer, "https://belin.io/");
			assert.equal(json.user_agent, "Doom/6.6.6");
			assert.equal(json.user_ip, "127.0.0.1");
		});
	});
});
