import {Author, Blog, CheckResult, Client, Comment, CommentType} from "@cedx/akismet";
import console from "node:console";

// Checks a comment against the Akismet service.
try {
	const author = new Author({
		email: "john.doe@domain.com",
		ipAddress: "192.168.123.456",
		name: "John Doe",
		role: "guest",
		userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0"
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
	const message = error instanceof Error ? error.message : String(error);
	console.log(`An error occurred: ${message}`);
}
