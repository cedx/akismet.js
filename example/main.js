import {Author, Blog, CheckResult, Client, ClientError, Comment, CommentType} from "@cedx/akismet";

/**
 * Queries the Akismet service.
 * @return {Promise<void>} Completes when the program is terminated.
 */
async function main() {
	try {
		const blog = new Blog(new URL("https://www.yourblog.com"), {charset: "UTF-8", languages: ["fr"]});
		const client = new Client("123YourAPIKey", blog);

		// Key verification.
		const isValid = await client.verifyKey();
		console.log(isValid ? "The API key is valid" : "The API key is invalid");

		// Comment check.
		const author = new Author(
			"192.168.123.456",
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0", {
			email: "john.doe@domain.com",
			name: "John Doe",
			role: "guest"
		});

		const comment = new Comment(
			author, {
			date: new Date,
			content: "A user comment",
			type: CommentType.contactForm
		});

		const result = await client.checkComment(comment);
		console.log(result == CheckResult.isHam ? "The comment is ham" : "The comment is spam");

		// Submit spam / ham.
		await client.submitSpam(comment);
		console.log("Spam submitted");

		await client.submitHam(comment);
		console.log("Ham submitted");
	}

	catch (err) {
		console.log(`An error occurred: ${err.message}`);
		if (err instanceof ClientError) console.log(`From: ${err.uri.href}`);
	}
}
