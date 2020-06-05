# Submit spam
This call is for submitting comments that weren't marked as spam but should have been.

```
Client.submitSpam(comment: Comment): Promise<void>
```

It is very important that the values you submit with this call match those of your [comment check](comment_check.md) calls as closely as possible.
In order to learn from its mistakes, Akismet needs to match your missed spam and false positive reports
to the original [comment check](comment_check.md) API calls made when the content was first posted. While it is normal for less information
to be available for [submit spam](submit_spam.md) and [submit ham](submit_ham.md) calls (most comment systems and forums will not store all metadata),
you should ensure that the values that you do send match those of the original content.

See the [Akismet API documentation](https://akismet.com/development/api/#submit-spam) for more information.

## Parameters

### **comment**: Comment
The user `Comment` to be submitted, incorrectly classified as ham.

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
		const comment = new Comment(author, {content: "An invalid user comment (spam)"});

		const blog = new Blog(new URL("https://www.yourblog.com"));
		const client = new Client("123YourAPIKey", blog);

		const result = await client.checkComment(comment);
		// Got `CheckResult.isHam`, but `CheckResult.isSpam` expected.
		
		console.log("The comment was incorrectly classified as ham.");
		await client.submitSpam(comment);
	}
		
	catch (err) {
		console.log(`An error occurred: ${err.message}`);
	}
}
```
