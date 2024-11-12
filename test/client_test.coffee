import {Author, AuthorRole, Blog, CheckResult, Client, Comment, CommentType} from "@cedx/akismet"
import {doesNotReject, equal, ok} from "node:assert/strict"
import {env} from "node:process"
import {describe, it} from "node:test"

# Tests the features of the `Client` class.
describe "Client", ->
	# The client used to query the remote API.
	client = new Client env.AKISMET_API_KEY or "", new Blog(url: "https://github.com/cedx/akismet.js"), isTest: yes

	# A comment with content marked as ham.
	ham = new Comment
		author: new Author
			ipAddress: "192.168.0.1"
			name: "Akismet"
			role: AuthorRole.administrator
			url: "https://belin.io"
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
		content: "I'm testing out the Service API."
		referrer: "https://www.npmjs.com/package/@cedx/akismet"
		type: CommentType.comment

	# A comment with content marked as spam.
	spam = new Comment
		author: new Author
			email: "akismet-guaranteed-spam@example.com"
			ipAddress: "127.0.0.1"
			name: "viagra-test-123"
			userAgent: "Spam Bot/6.6.6"
		content: "Spam!"
		type: CommentType.blogPost

	describe "checkComment()", ->
		it "should return `CheckResult.ham` for valid comment (e.g. ham)", ->
			equal await client.checkComment(ham), CheckResult.ham

		it "should return `CheckResult.spam` for invalid comment (e.g. spam)", ->
			isSpam = new Set [CheckResult.spam, CheckResult.pervasiveSpam]
			ok isSpam.has await client.checkComment spam

	describe "submitHam()", ->
		it "should complete without any error", -> await doesNotReject client.submitHam ham

	describe "submitSpam()", ->
		it "should complete without any error", -> await doesNotReject client.submitSpam spam

	describe "verifyKey()", ->
		it "should return `true` for a valid API key", ->
			ok await client.verifyKey()

		it "should return `false` for an invalid API key", ->
			equal await new Client("0123456789-ABCDEF", client.blog, isTest: yes).verifyKey(), no
