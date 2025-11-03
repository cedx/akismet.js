import {Author} from "@cedx/akismet";
import {equal} from "node:assert/strict";
import {describe, it} from "node:test";

/**
 * Tests the features of the {@link Author} class.
 */
describe("Author", () => {
	describe("toJSON()", () => {
		it("should return only the IP address with a newly created instance", () => {
			const json = new Author({ipAddress: "127.0.0.1"}).toJSON();
			equal(Object.keys(json).length, 1);
			equal(json.user_ip, "127.0.0.1");
		});

		it("should return a non-empty map with an initialized instance", () => {
			const json = new Author({
				email: "contact@cedric-belin.fr",
				ipAddress: "192.168.0.1",
				name: "Cédric Belin",
				url: "https://cedric-belin.fr",
				userAgent: "Mozilla/5.0"
			}).toJSON();

			equal(Object.keys(json).length, 5);
			equal(json.comment_author, "Cédric Belin");
			equal(json.comment_author_email, "contact@cedric-belin.fr");
			equal(json.comment_author_url, "https://cedric-belin.fr/");
			equal(json.user_agent, "Mozilla/5.0");
			equal(json.user_ip, "192.168.0.1");
		});
	});
});
