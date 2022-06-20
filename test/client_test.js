import assert from "node:assert/strict";
import test from "node:test";
import {Author, Blog, CheckResult, Client, Comment, CommentType} from "../lib/index.js";

// The default test client.
const blog = new Blog("https://github.com/cedx/akismet.js");
const _client = new Client(process.env.AKISMET_API_KEY, blog, {isTest: true});

// A message marked as ham.
let author = new Author("192.168.0.1", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0", {
	name: "Akismet",
	role: "administrator",
	url: "https://github.com/cedx/akismet.js"
});

const _ham = new Comment(author, {
	content: "I'm testing out the Service API.",
	referrer: "https://www.npmjs.com/package/@cedx/akismet",
	type: CommentType.comment
});

// A message marked as spam.
author = new Author("127.0.0.1", "Spam Bot/6.6.6", {
	email: "akismet-guaranteed-spam@example.com",
	name: "viagra-test-123"
});

const _spam = new Comment(author, {
	content: "Spam!",
	type: CommentType.trackback
});

test("Client.checkComment()", async ctx => {
	await ctx.test("should return `CheckResult.ham` for valid comment (e.g. ham)", async () => {
		assert.equal(await _client.checkComment(_ham), CheckResult.ham);
	});

	await ctx.test("should return `CheckResult.spam` for invalid comment (e.g. spam)", async () => {
		const result = await _client.checkComment(_spam);
		assert.ok(result == CheckResult.spam || result == CheckResult.pervasiveSpam);
	});
});

test("Client.submitHam()", async ctx => {
	await ctx.test("should complete without any error", () => {
		return assert.doesNotReject(_client.submitHam(_ham));
	});
});

test("Client.submitSpam()", async ctx => {
	await ctx.test("should complete without any error", () => {
		return assert.doesNotReject(_client.submitSpam(_ham));
	});
});

test("Client.verifyKey()", async ctx => {
	await ctx.test("should return `true` for a valid API key", async () => {
		assert.ok(await _client.verifyKey());
	});

	await ctx.test("should return `false` for an invalid API key", async () => {
		const client = new Client("0123456789-ABCDEF", _client.blog, {isTest: true});
		assert.equal(await client.verifyKey(), false);
	});
});
