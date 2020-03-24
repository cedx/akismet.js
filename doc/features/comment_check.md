path: blob/master
source: src/comment.ts

# Comment check
This is the call you will make the most. It takes a number of arguments and characteristics about the submitted content
and then returns a thumbs up or thumbs down. **Performance can drop dramatically if you choose to exclude data points.**
The more data you send Akismet about each comment, the greater the accuracy. We recommend erring on the side of including too much data.

```
Client.checkComment(comment: Comment): Promise<CheckResult>
```

It is important to [test Akismet](../advanced/testing.md) with a significant amount of real, live data in order to draw any conclusions on accuracy.
Akismet works by comparing content to genuine spam activity happening **right now** (and this is based on more than just the content itself),
so artificially generating spam comments is not a viable approach.

See the [Akismet API documentation](https://akismet.com/development/api/#comment-check) for more information.

## Parameters

### **comment**: Comment
The `Comment` providing the user message to be checked.

## Return value
A `Promise` that resolves with a `CheckResult` value indicating whether the given `Comment` is ham, spam or pervasive spam.

!!! tip
    A comment classified as pervasive spam can be safely discarded.

The promise rejects with a `ClientError` exception when an error occurs.
The exception `message` usually includes some debug information, provided by the `X-akismet-debug-help` HTTP header, about what exactly was invalid about the call.

## Example

```js
import {Author, Blog, CheckResult, Client, Comment} from '@cedx/akismet';

async function main() {
  try {
    const author = new Author('127.0.0.1', 'Mozilla/5.0');
    const comment = new Comment(author, {content: 'A user comment', date: new Date});

    const blog = new Blog(new URL('https://www.yourblog.com'));
    const client = new Client('123YourAPIKey', blog);

    const result = await client.checkComment(comment);
    console.log(result == CheckResult.isHam ? 'The comment is ham.' : 'The comment is spam.');
  }

  catch (err) {
    console.log(`An error occurred: ${err.message}`);
  }
}
```

See the [API reference](https://dev.belin.io/akismet.js/api) of this library for detailed information about the `Author` and `Comment` classes, and their properties.
