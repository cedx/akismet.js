import assert from "node:assert/strict";
import test from "node:test";
import {Author} from "../lib/index.js";

test("Author.fromJson()", async ctx => {
	await ctx.test("should return an empty instance with an empty map", () => {
		const author = Author.fromJson({});
		assert.equal(author.email.length, 0);
		assert.equal(author.ipAddress.length, 0);
		assert.equal(author.url, null);
		assert.equal(author.userAgent.length, 0);
	});

	await ctx.test("should return an initialized instance with a non-empty map", () => {
		const author = Author.fromJson({
			comment_author_email: "cedric@belin.io",
			comment_author_url: "https://belin.io",
			user_agent: "Mozilla/5.0",
			user_ip: "127.0.0.1"
		});

		assert.equal(author.email, "cedric@belin.io");
		assert.equal(author.ipAddress, "127.0.0.1");
		assert.ok(author.url instanceof URL);
		assert.equal(author.url.href, "https://belin.io/");
		assert.equal(author.userAgent, "Mozilla/5.0");
	});
});

test("Author.toJSON()", async ctx => {
	await ctx.test("should return only the IP address with a newly created instance", () => {
		const data = new Author({ipAddress: "127.0.0.1"}).toJSON();
		assert.equal(Object.keys(data).length, 1);
		assert.equal(data.user_ip, "127.0.0.1");
	});

	await ctx.test("should return a non-empty map with an initialized instance", () => {
		const data = new Author({
			email: "cedric@belin.io",
			ipAddress: "192.168.0.1",
			name: "Cédric Belin",
			url: "https://belin.io",
			userAgent: "Mozilla/5.0"
		}).toJSON();

		assert.equal(Object.keys(data).length, 5);
		assert.equal(data.comment_author, "Cédric Belin");
		assert.equal(data.comment_author_email, "cedric@belin.io");
		assert.equal(data.comment_author_url, "https://belin.io/");
		assert.equal(data.user_agent, "Mozilla/5.0");
		assert.equal(data.user_ip, "192.168.0.1");
	});
});
