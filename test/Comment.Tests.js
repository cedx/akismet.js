import {Author, Comment, CommentType} from "@cedx/akismet";
import {equal} from "node:assert/strict";
import {describe, it} from "node:test";

/**
 * Tests the features of the {@link Comment} class.
 */
describe("Comment", () => {
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
				referrer: "https://cedric-belin.fr",
				type: CommentType.BlogPost
			}).toJSON();

			equal(Object.keys(json).length, 7);
			equal(json.comment_author, "Cédric Belin");
			equal(json.comment_content, "A user comment.");
			equal(json.comment_date_gmt, "2000-01-01T00:00:00.000Z");
			equal(json.comment_type, "blog-post");
			equal(json.referrer, "https://cedric-belin.fr/");
			equal(json.user_agent, "Doom/6.6.6");
			equal(json.user_ip, "127.0.0.1");
		});
	});
});
