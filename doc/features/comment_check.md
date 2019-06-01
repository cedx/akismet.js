# Comment check
This is the call you will make the most. It takes a number of arguments and characteristics about the submitted content
and then returns a thumbs up or thumbs down. **Performance can drop dramatically if you choose to exclude data points.**
The more data you send Akismet about each comment, the greater the accuracy. We recommend erring on the side of including too much data.

```
Client#checkComment(comment: Comment): Promise<boolean>
```

!!! tip "Testing your data"
    It is important to test Akismet with a significant amount of real, live data in order to draw any conclusions on accuracy.
    Akismet works by comparing content to genuine spam activity happening right now (and this is based on more than just the content itself),
    so artificially generating spam comments is not a viable approach.

## Parameters

### **comment**: Comment
The `Comment` providing the user message to be checked.

## Return value
A `Promise` that resolves with a `boolean` value indicating whether the given `Comment` is spam.

The promise rejects with a `ClientError` exception when an error occurs.
The exception `message` usually includes some debug information, provided by the `X-akismet-debug-help` HTTP header, about what exactly was invalid about the call.

## Example

```js
import {Author, Blog, Client, Comment} from '@cedx/akismet';

async function main(): Promise {
  try {
    const comment = new Comment(
      new Author('127.0.0.1', 'Mozilla/5.0'),
      {content: 'A user comment', date: new Date}
    );

    const client = new Client('123YourAPIKey', new Blog(new URL('https://www.yourblog.com')));
    const isSpam = await client.checkComment(comment);
    console.log(isSpam ? 'The comment is spam' : 'The comment is ham');
  }

  catch (err) {
    console.log(`An error occurred: ${err.message}`);
  }
}
```
