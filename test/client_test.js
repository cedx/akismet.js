import {strict as assert} from "assert";
import {Author, Blog, CheckResult, Client, Comment, CommentType} from "../lib/index.js";

/** Tests the features of the `Client` class. */
describe("Client", function() {
	this.timeout(15000);

	// The default test client.
	const blog = new Blog(new URL("https://docs.belin.io/akismet.js"));
	const _client = new Client(process.env.AKISMET_API_KEY, blog, {isTest: true});

	// A message marked as ham.
	let author = new Author("192.168.0.1", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0", {
		name: "Akismet",
		role: "administrator",
		url: new URL("https://docs.belin.io/akismet.js")
	});

	const _ham = new Comment(author, {
		content: "I'm testing out the Service API.",
		referrer: new URL("https://www.npmjs.com/package/@cedx/akismet"),
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

	describe(".checkComment()", function() {
		it("should return `CheckResult.isHam` for valid comment (e.g. ham)", async function() {
			assert.equal(await _client.checkComment(_ham), CheckResult.isHam);
		});

		it("should return `CheckResult.isSpam` for invalid comment (e.g. spam)", async function() {
			const result = await _client.checkComment(_spam);
			assert(result == CheckResult.isSpam || result == CheckResult.isPervasiveSpam);
		});
	});

	describe(".submitHam()", function() {
		it("should complete without any error", async function() {
			try { await _client.submitHam(_ham); }
			catch (err) { assert.fail(err.message); }
		});
	});

	describe(".submitSpam()", function() {
		it("should complete without any error", async function() {
			try { await _client.submitSpam(_spam); }
			catch (err) { assert.fail(err.message); }
		});
	});

	describe(".verifyKey()", function() {
		it("should return `true` for a valid API key", async function() {
			assert(await _client.verifyKey());
		});

		it("should return `false` for an invalid API key", async function() {
			const client = new Client("0123456789-ABCDEF", _client.blog, {isTest: true});
			assert.equal(await client.verifyKey(), false);
		});
	});
});
