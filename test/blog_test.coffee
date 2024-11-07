import {Blog} from "@cedx/akismet"
import {deepEqual, equal, ok} from "node:assert/strict"
import {describe, it} from "node:test"

# Tests the features of the `Blog` class.
describe "Blog", ->
	describe "fromJson()", ->
		it "should return an empty instance with an empty map", ->
			blog = Blog.fromJson {}
			equal blog.charset.length, 0
			equal blog.languages.length, 0
			equal blog.url, null

		it "should return an initialized instance with a non-empty map", ->
			blog = Blog.fromJson
				blog: "https://github.com/cedx/akismet.js"
				blog_charset: "UTF-8"
				blog_lang: "en, fr"

			equal blog.charset, "UTF-8"
			deepEqual blog.languages, ["en", "fr"]
			ok blog.url instanceof URL
			equal blog.url.href, "https://github.com/cedx/akismet.js"

	describe "toJSON()", ->
		it "should return only the blog URL with a newly created instance", ->
			json = new Blog(url: "https://github.com/cedx/akismet.js").toJSON()
			equal Object.keys(json).length, 1
			equal json.blog, "https://github.com/cedx/akismet.js"

		it "should return a non-empty map with an initialized instance", ->
			json = new Blog(charset: "UTF-8", languages: ["en", "fr"], url: "https://github.com/cedx/akismet.js").toJSON()
			equal Object.keys(json).length, 3
			equal json.blog, "https://github.com/cedx/akismet.js"
			equal json.blog_charset, "UTF-8"
			equal json.blog_lang, "en,fr"
