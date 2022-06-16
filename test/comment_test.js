import {strict as assert} from "assert";
import {Author, Comment, CommentType} from "../lib/index.js";

/** Tests the features of the {@link Comment} class. */
describe("Comment", function() {
	describe(".fromJson()", function() {
		it("should return an empty instance with an empty map", function() {
			const comment = Comment.fromJson({});
			assert.equal(comment.author, undefined);
			assert.equal(comment.content.length, 0);
			assert.equal(comment.date, undefined);
			assert.equal(comment.referrer, undefined);
			assert.equal(comment.type.length, 0);
		});

		it("should return an initialized instance with a non-empty map", function() {
			const comment = Comment.fromJson({
				comment_author: "Cédric Belin",
				comment_content: "A user comment.",
				comment_date_gmt: "2000-01-01T00:00:00.000Z",
				comment_type: "trackback",
				referrer: "https://belin.io"
			});

			assert(comment.author instanceof Author);
			assert.equal(comment.author.name, "Cédric Belin");
			assert.equal(comment.content, "A user comment.");
			assert(comment.date instanceof Date);
			assert.equal(comment.date.getFullYear(), 2000);
			assert(comment.referrer instanceof URL);
			assert.equal(comment.referrer.href, "https://belin.io/");
			assert.equal(comment.type, CommentType.trackback);
		});
	});

	describe(".toJSON()", function() {
		it("should return only the author info with a newly created instance", function() {
			const data = new Comment(new Author("127.0.0.1", "Doom/6.6.6")).toJSON();
			assert.equal(Object.keys(data).length, 2);
			assert.equal(data.user_agent, "Doom/6.6.6");
			assert.equal(data.user_ip, "127.0.0.1");
		});

		it("should return a non-empty map with an initialized instance", function() {
			const data = new Comment(new Author("127.0.0.1", "Doom/6.6.6", {name: "Cédric Belin"}), {
				content: "A user comment.",
				date: new Date("2000-01-01T00:00:00.000Z"),
				referrer: new URL("https://belin.io"),
				type: CommentType.pingback
			}).toJSON();

			assert.equal(Object.keys(data).length, 7);
			assert.equal(data.comment_author, "Cédric Belin");
			assert.equal(data.comment_content, "A user comment.");
			assert.equal(data.comment_date_gmt, "2000-01-01T00:00:00.000Z");
			assert.equal(data.comment_type, "pingback");
			assert.equal(data.referrer, "https://belin.io/");
			assert.equal(data.user_agent, "Doom/6.6.6");
			assert.equal(data.user_ip, "127.0.0.1");
		});
	});
});
