# Submit ham
This call is intended for the submission of false positives - items that were incorrectly classified as spam by Akismet.
It takes identical arguments as [comment check](comment_check.md) and [submit spam](submit_spam.md).

```
Client.submitHam(comment: Comment): Promise<void>
```

Remember that, as explained in the [submit spam](submit_spam.md) documentation, you should ensure
that any values you're passing here match up with the original and corresponding [comment check](comment_check.md) call.

See the [Akismet API documentation](https://akismet.com/development/api/#submit-ham) for more information.

## Parameters

### **comment**: Comment
The user `Comment` to be submitted, incorrectly classified as spam.

!!! tip
	Ideally, it should be the same object as the one passed to the original [comment check](comment_check.md) API call.

## Return value
A `Promise` that resolves when the given `Comment` has been submitted.

The promise rejects with a `ClientError` exception when an error occurs.
The exception `message` usually includes some debug information, provided by the `X-akismet-debug-help` HTTP header, about what exactly was invalid about the call.

## Example

``` js
import {Author, Blog, Client, Comment} from "@cedx/akismet";

async function main() {
	try {
		const author = new Author("127.0.0.1", "Mozilla/5.0");
		const comment = new Comment(author, {content: "A valid user comment (ham)"});

		const blog = new Blog(new URL("https://www.yourblog.com"));
		const client = new Client("123YourAPIKey", blog);

		const result = await client.checkComment(comment);
		// Got `CheckResult.isSpam`, but `CheckResult.isHam` expected.

		console.log("The comment was incorrectly classified as spam.");
		await client.submitHam(comment);
	}
		
	catch (err) {
		console.log(`An error occurred: ${err.message}`);
	}
}
```
