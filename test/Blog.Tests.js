import {Blog} from "@cedx/akismet";
import {equal} from "node:assert/strict";
import {describe, it} from "node:test";

/**
 * Tests the features of the {@link Blog} class.
 */
describe("Blog", () => {
	describe("toJSON()", () => {
		it("should return only the blog URL with a newly created instance", () => {
			const json = new Blog({url: "https://github.com/cedx/akismet.js"}).toJSON();
			equal(Object.keys(json).length, 1);
			equal(json.blog, "https://github.com/cedx/akismet.js");
		});

		it("should return a non-empty map with an initialized instance", () => {
			const json = new Blog({charset: "UTF-8", languages: ["en", "fr"], url: "https://github.com/cedx/akismet.js"}).toJSON();
			equal(Object.keys(json).length, 3);
			equal(json.blog, "https://github.com/cedx/akismet.js");
			equal(json.blog_charset, "UTF-8");
			equal(json.blog_lang, "en,fr");
		});
	});
});
