import assert from "node:assert/strict";
import test from "node:test";
import {Author, Comment, CommentType} from "../lib/index.js";

test("Comment.fromJson()", async ctx => {
	await ctx.test("should return an empty instance with an empty map", () => {
		const comment = Comment.fromJson({});
		assert.equal(comment.author, null);
		assert.equal(comment.content.length, 0);
		assert.equal(comment.date, null);
		assert.equal(comment.referrer, null);
		assert.equal(comment.type.length, 0);
	});

	await ctx.test("should return an initialized instance with a non-empty map", () => {
		const comment = Comment.fromJson({
			comment_author: "Cédric Belin",
			comment_content: "A user comment.",
			comment_date_gmt: "2000-01-01T00:00:00.000Z",
			comment_type: "blog-post",
			referrer: "https://belin.io"
		});

		assert.ok(comment.author instanceof Author);
		assert.equal(comment.author.name, "Cédric Belin");
		assert.equal(comment.content, "A user comment.");
		assert.ok(comment.date instanceof Date);
		assert.equal(comment.date.getFullYear(), 2000);
		assert.ok(comment.referrer instanceof URL);
		assert.equal(comment.referrer.href, "https://belin.io/");
		assert.equal(comment.type, CommentType.blogPost);
	});
});

test("Comment.toJSON()", async ctx => {
	await ctx.test("should return only the author info with a newly created instance", () => {
		const data = new Comment(new Author("127.0.0.1", "Doom/6.6.6")).toJSON();
		assert.equal(Object.keys(data).length, 2);
		assert.equal(data.user_agent, "Doom/6.6.6");
		assert.equal(data.user_ip, "127.0.0.1");
	});

	await ctx.test("should return a non-empty map with an initialized instance", () => {
		const data = new Comment(new Author("127.0.0.1", "Doom/6.6.6", {name: "Cédric Belin"}), {
			content: "A user comment.",
			date: new Date("2000-01-01T00:00:00.000Z"),
			referrer: "https://belin.io",
			type: CommentType.blogPost
		}).toJSON();

		assert.equal(Object.keys(data).length, 7);
		assert.equal(data.comment_author, "Cédric Belin");
		assert.equal(data.comment_content, "A user comment.");
		assert.equal(data.comment_date_gmt, "2000-01-01T00:00:00.000Z");
		assert.equal(data.comment_type, "blog-post");
		assert.equal(data.referrer, "https://belin.io/");
		assert.equal(data.user_agent, "Doom/6.6.6");
		assert.equal(data.user_ip, "127.0.0.1");
	});
});
