# Submit ham
This call is intended for the submission of false positives - items that were incorrectly classified as spam by Akismet.
It takes identical arguments as [comment check](usage/check_comment.md) and [submit spam](usage/submit_spam.md).

```js
Client.submitHam(comment: Comment): Promise<void>
```

Remember that, as explained in the [submit spam](usage/submit_spam.md) documentation, you should ensure
that any values you're passing here match up with the original and corresponding [comment check](usage/check_comment.md) call.

See the [Akismet API documentation](https://akismet.com/developers/detailed-docs/submit-ham-false-positives) for more information.

## Parameters

### **comment**: Comment
The user's `Comment` to be submitted, incorrectly classified as spam.

> Ideally, it should be the same object as the one passed to the original [comment check](usage/check_comment.md) API call.

## Return value
A `Promise` that resolves when the given `Comment` has been submitted.

The promise rejects with an `Error` when an issue occurs.
The error `message` usually includes some debug information, provided by the `X-akismet-debug-help` HTTP header,
about what exactly was invalid about the call.

It can also reject with a custom error code and message (respectively provided by the `X-akismet-alert-code` and `X-akismet-alert-msg` headers).
See [Response Error Codes](https://akismet.com/developers/detailed-docs/errors) for more information.

## Example

```js
import console from "node:console";
import {Author, Blog, Client, Comment} from "@cedx/akismet";

try {
  const blog = new Blog({url: "https://www.yourblog.com"});
  const client = new Client("123YourAPIKey", blog);

  const comment = new Comment({
    content: "I'm testing out the Service API.",
    author: new Author({
      ipAddress: "192.168.123.456",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    })
  });

  await client.submitHam(comment);
  console.log("The comment was successfully submitted as ham.");
}
catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log(`An error occurred: ${message}`);
}
```
