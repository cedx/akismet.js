import console from "node:console";
import {Author, Blog, Client, Comment} from "@cedx/akismet";

/**
 * Submits spam to the Akismet service.
 */
try {
	const author = new Author({
		ipAddress: "192.168.123.456",
		userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
	});

	const client = new Client("123YourAPIKey", new Blog({url: "https://www.yourblog.com"}));
	const comment = new Comment({author, content: "A user comment"});
	await client.submitSpam(comment);
	console.log("The comment was successfully submitted as spam.");
}

catch (error) {
	console.log(`An error occurred: ${error}`);
}
