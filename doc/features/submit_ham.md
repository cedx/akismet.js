# Submit ham
This call is intended for the submission of false positives - items that were incorrectly classified as spam by Akismet. It takes identical arguments as [comment check](comment_check.md) and [submit spam](submit_spam.md).

Remember that, as explained in the [submit spam](submit_spam.md) documentation, you should ensure that any values you're passing here match up with the original and corresponding [comment check](comment_check.md) call.

```
Client#submitHam(comment: Comment): Promise
```

## Parameters

### comment
The user `Comment` to be submitted, incorrectly classified as spam.

!!! tip
    It should be the same object instance as the one passed to the original [comment check](comment_check.md) API call.

## Return value
A `Promise` that resolves when the given `Comment` has been submitted.

The promise rejects with a `ClientError` exception when an error occurs.
The exception `message` usually includes some debug information, provided by the `X-akismet-debug-help` HTTP header, about what exactly was invalid about the call.

## Example

```js
const {Author, Client, Comment} = require('@cedx/akismet');

async function main() {
  try {
    let comment = new Comment(
      new Author('127.0.0.1', 'Mozilla/5.0'),
      {content: 'A valid user comment (ham)'}
    );

    let client = new Client('123YourAPIKey', 'http://www.yourblog.com');
    let isSpam = await client.checkComment(comment); // `true`, but `false` expected.
    
    console.log('The comment was incorrectly classified as spam');
    await client.submitHam(comment);
  }
    
  catch (err) {
    console.log(`An error occurred: ${err.message}`);
  }
}
```
