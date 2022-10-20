import console from "node:console";
import {Author, Blog, Client, Comment} from "@cedx/akismet";

/**
 * Submits spam to the Akismet service.
 */
try {
	const blog = new Blog({url: "https://www.yourblog.com"});
	const client = new Client("123YourAPIKey", blog);

	const comment = new Comment({
		content: "Spam!",
		author: new Author({
			ipAddress: "192.168.123.456",
			userAgent: "Spam Bot/6.6.6"
		})
	});

	await client.submitSpam(comment);
	console.log("The comment was successfully submitted as spam.");
}
catch (error) {
	console.log(`An error occurred: ${error}`);
}
