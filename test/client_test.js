import assert from "node:assert/strict";
import {env} from "node:process";
import {describe, it} from "node:test";
import {Author, AuthorRole, Blog, CheckResult, Client, Comment, CommentType} from "#akismet";

/**
 * Tests the features of the {@link Client} class.
 */
describe("Client", () => {
	// The client used to query the remote API.
	const client = new Client(
		env.AKISMET_API_KEY ?? "",
		new Blog({url: "https://github.com/cedx/akismet.js"}),
		{isTest: true}
	);

	// A comment with content marked as ham.
	const ham = new Comment({
		author: new Author({
			ipAddress: "192.168.0.1",
			name: "Akismet",
			role: AuthorRole.administrator,
			url: "https://belin.io",
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0"
		}),
		content: "I'm testing out the Service API.",
		referrer: "https://www.npmjs.com/package/@cedx/akismet",
		type: CommentType.comment
	});

	// A comment with content marked as spam.
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

	describe("checkComment()", () => {
		it("should return `CheckResult.ham` for valid comment (e.g. ham)", async () => {
			assert.equal(await client.checkComment(ham), CheckResult.ham);
		});

		it("should return `CheckResult.spam` for invalid comment (e.g. spam)", async () => {
			const isSpam = /** @type {CheckResult[]} */ ([CheckResult.spam, CheckResult.pervasiveSpam]);
			assert.ok(isSpam.includes(await client.checkComment(spam)));
		});
	});

	describe("submitHam()", () => {
		it("should complete without any error", () => assert.doesNotReject(client.submitHam(ham)));
	});

	describe("submitSpam()", () => {
		it("should complete without any error", () => assert.doesNotReject(client.submitSpam(spam)));
	});

	describe("verifyKey()", () => {
		it("should return `true` for a valid API key", async () => {
			assert.ok(await client.verifyKey());
		});

		it("should return `false` for an invalid API key", async () => {
			assert.equal(await new Client("0123456789-ABCDEF", client.blog, {isTest: true}).verifyKey(), false);
		});
	});
});
