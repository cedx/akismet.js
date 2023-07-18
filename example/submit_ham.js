import console from "node:console";
import {Author, Blog, Client, Comment} from "@cedx/akismet";

/**
 * Submits ham to the Akismet service.
 */
try {
	const blog = new Blog({url: "https://www.yourblog.com"});
	const client = new Client("123YourAPIKey", blog);

	const comment = new Comment({
		content: "I'm testing out the Service API.",
		author: new Author({
			ipAddress: "192.168.123.456",
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0"
		})
	});

	await client.submitHam(comment);
	console.log("The comment was successfully submitted as ham.");
}
catch (error) {
	console.log(`An error occurred: ${error}`);
}
