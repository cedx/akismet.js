import {equal, ok} from "node:assert/strict";
import {describe, it} from "node:test";
import {Author, AuthorRole} from "#akismet";

/**
 * Tests the features of the {@link Author} class.
 */
describe("Author", () => {
	describe("fromJson()", () => {
		it("should return an empty instance with an empty map", () => {
			const author = Author.fromJson({});
			equal(author.email.length, 0);
			equal(author.ipAddress.length, 0);
			equal(author.name.length, 0);
			equal(author.role.length, 0);
			equal(author.url, null);
			equal(author.userAgent.length, 0);
		});

		it("should return an initialized instance with a non-empty map", () => {
			const author = Author.fromJson({
				comment_author: "Cédric Belin",
				comment_author_email: "cedric@belin.io",
				comment_author_url: "https://belin.io",
				user_agent: "Mozilla/5.0",
				user_ip: "127.0.0.1",
				user_role: "administrator"
			});

			equal(author.email, "cedric@belin.io");
			equal(author.ipAddress, "127.0.0.1");
			equal(author.role, AuthorRole.administrator);
			ok(author.url instanceof URL);
			equal(author.url.href, "https://belin.io/");
			equal(author.userAgent, "Mozilla/5.0");
		});
	});

	describe("toJSON()", () => {
		it("should return only the IP address with a newly created instance", () => {
			const json = new Author({ipAddress: "127.0.0.1"}).toJSON();
			equal(Object.keys(json).length, 1);
			equal(json.user_ip, "127.0.0.1");
		});

		it("should return a non-empty map with an initialized instance", () => {
			const json = new Author({
				email: "cedric@belin.io",
				ipAddress: "192.168.0.1",
				name: "Cédric Belin",
				url: "https://belin.io",
				userAgent: "Mozilla/5.0"
			}).toJSON();

			equal(Object.keys(json).length, 5);
			equal(json.comment_author, "Cédric Belin");
			equal(json.comment_author_email, "cedric@belin.io");
			equal(json.comment_author_url, "https://belin.io/");
			equal(json.user_agent, "Mozilla/5.0");
			equal(json.user_ip, "192.168.0.1");
		});
	});
});
