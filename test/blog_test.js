import assert from "node:assert/strict";
import {describe, it} from "node:test";
import {Blog} from "#akismet";

/**
 * Tests the features of the {@link Blog} class.
 */
describe("Blog", () => {
	describe("fromJson()", () => {
		it("should return an empty instance with an empty map", () => {
			const blog = Blog.fromJson({});
			assert.equal(blog.charset.length, 0);
			assert.equal(blog.languages.length, 0);
			assert.equal(blog.url, null);
		});

		it("should return an initialized instance with a non-empty map", () => {
			const blog = Blog.fromJson({
				blog: "https://github.com/cedx/akismet.js",
				blog_charset: "UTF-8",
				blog_lang: "en, fr"
			});

			assert.equal(blog.charset, "UTF-8");
			assert.deepEqual(blog.languages, ["en", "fr"]);
			assert.ok(blog.url instanceof URL);
			assert.equal(blog.url.href, "https://github.com/cedx/akismet.js");
		});
	});

	describe("toJSON()", () => {
		it("should return only the blog URL with a newly created instance", () => {
			const json = new Blog({url: "https://github.com/cedx/akismet.js"}).toJSON();
			assert.equal(Object.keys(json).length, 1);
			assert.equal(json.blog, "https://github.com/cedx/akismet.js");
		});

		it("should return a non-empty map with an initialized instance", () => {
			const json = new Blog({charset: "UTF-8", languages: ["en", "fr"], url: "https://github.com/cedx/akismet.js"}).toJSON();
			assert.equal(Object.keys(json).length, 3);
			assert.equal(json.blog, "https://github.com/cedx/akismet.js");
			assert.equal(json.blog_charset, "UTF-8");
			assert.equal(json.blog_lang, "en,fr");
		});
	});
});
