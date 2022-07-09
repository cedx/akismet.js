import assert from "node:assert/strict";
import {env} from "node:process";
import test from "node:test";
import {Author, AuthorRole, Blog, CheckResult, Client, Comment, CommentType} from "../src/index.js";

// The default test client.
const client = new Client(
	env.AKISMET_API_KEY ?? "",
	new Blog({url: "https://github.com/cedx/akismet.js"}),
	{isTest: true}
);

// A message marked as ham.
const ham = new Comment({
	author: new Author({
		ipAddress: "192.168.0.1",
		name: "Akismet",
		role: AuthorRole.administrator,
		url: "https://belin.io",
		userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
	}),
	content: "I'm testing out the Service API.",
	referrer: "https://www.npmjs.com/package/@cedx/akismet",
	type: CommentType.comment
});

// A message marked as spam.
const spam = new Comment({
	author: new Author({
		email: "akismet-guaranteed-spam@example.com",
		ipAddress: "127.0.0.1",
		name: "viagra-test-123",
		userAgent: "Spam Bot/6.6.6"
	}),
	content: "Spam!",
	type: CommentType.blogPost
});

test("Client.checkComment()", async ctx => {
	await ctx.test("should return `CheckResult.ham` for valid comment (e.g. ham)", async () => {
		assert.equal(await client.checkComment(ham), CheckResult.ham);
	});

	await ctx.test("should return `CheckResult.spam` for invalid comment (e.g. spam)", async () => {
		const result = await client.checkComment(spam);
		assert.ok([CheckResult.spam, CheckResult.pervasiveSpam].includes(result));
	});
});

test("Client.submitHam()", async ctx => {
	await ctx.test("should complete without any error", () => assert.doesNotReject(client.submitHam(ham)));
});

test("Client.submitSpam()", async ctx => {
	await ctx.test("should complete without any error", () => assert.doesNotReject(client.submitSpam(spam)));
});

test("Client.verifyKey()", async ctx => {
	await ctx.test("should return `true` for a valid API key", async () => {
		assert.ok(await client.verifyKey());
	});

	await ctx.test("should return `false` for an invalid API key", async () => {
		assert.equal(await new Client("0123456789-ABCDEF", client.blog, {isTest: true}).verifyKey(), false);
	});
});
