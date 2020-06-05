import {strict as assert} from "assert";
import {Author} from "../lib/index.js";

/** Tests the features of the `Author` class. */
describe("Author", () => {
	describe(".fromJson()", () => {
		it("should return an empty instance with an empty map", () => {
			const author = Author.fromJson({});
			assert.equal(author.email.length, 0);
			assert.equal(author.ipAddress.length, 0);
			assert.equal(author.url, undefined);
			assert.equal(author.userAgent.length, 0);
		});

		it("should return an initialized instance with a non-empty map", () => {
			const author = Author.fromJson({
				comment_author_email: "cedric@belin.io",
				comment_author_url: "https://belin.io",
				user_agent: "Mozilla/5.0",
				user_ip: "127.0.0.1"
			});

			assert.equal(author.email, "cedric@belin.io");
			assert.equal(author.ipAddress, "127.0.0.1");
			assert(author.url instanceof URL);
			assert.equal(author.url.href, "https://belin.io/");
			assert.equal(author.userAgent, "Mozilla/5.0");
		});
	});

	describe(".toJSON()", () => {
		it("should return only the IP address and user agent with a newly created instance", () => {
			const data = new Author("127.0.0.1", "Doom/6.6.6").toJSON();
			assert.equal(Object.keys(data).length, 2);
			assert.equal(data.user_agent, "Doom/6.6.6");
			assert.equal(data.user_ip, "127.0.0.1");
		});

		it("should return a non-empty map with an initialized instance", () => {
			const data = new Author("192.168.0.1", "Mozilla/5.0", {
				email: "cedric@belin.io",
				name: "Cédric Belin",
				url: new URL("https://belin.io")
			}).toJSON();

			assert.equal(Object.keys(data).length, 5);
			assert.equal(data.comment_author, "Cédric Belin");
			assert.equal(data.comment_author_email, "cedric@belin.io");
			assert.equal(data.comment_author_url, "https://belin.io/");
			assert.equal(data.user_agent, "Mozilla/5.0");
			assert.equal(data.user_ip, "192.168.0.1");
		});
	});
});
