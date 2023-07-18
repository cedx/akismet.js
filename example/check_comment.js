import console from "node:console";
import {Author, Blog, CheckResult, Client, Comment, CommentType} from "@cedx/akismet";

/**
 * Checks a comment against the Akismet service.
 */
try {
	const author = new Author({
		email: "john.doe@domain.com",
		ipAddress: "192.168.123.456",
		name: "John Doe",
		role: "guest",
		userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0"
	});

	const comment = new Comment({
		author,
		date: new Date,
		content: "A user comment.",
		referrer: "https://github.com/cedx/akismet.js",
		type: CommentType.contactForm
	});

	const blog = new Blog({
		charset: "UTF-8",
		languages: ["fr"],
		url: "https://www.yourblog.com"
	});

	const result = await new Client("123YourAPIKey", blog).checkComment(comment);
	console.log(result == CheckResult.ham ? "The comment is ham." : "The comment is spam.");
}
catch (error) {
	console.log(`An error occurred: ${error}`);
}
