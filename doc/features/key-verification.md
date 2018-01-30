path: blob/master
source: lib/client.js

# Key verification
Key verification authenticates your key before calling the [comment check](comment-check.md), [submit spam](submit-spam.md), or [submit ham](submit-ham.md) methods. This is the first call that you should make to Akismet and is especially useful if you will have multiple users with their own Akismet subscriptions using your application.

```javascript
async Client#verifyKey()
```

## Parameters
None.

## Return value
A `Promise` that resolves with a `bool` value indicating whether the client's API key is valid.

The promise rejects with an `Error` exception when an error occurs.
The exception `message` usually includes some debug information, provided by the `X-akismet-debug-help` HTTP header, about what exactly was invalid about the call.

## Example

```javascript
const {Client} = require('@cedx/akismet');

try {
  let client = new Client('123YourAPIKey', 'http://www.yourblog.com');
  let isValid = await client.verifyKey();
  console.log(isValid ? 'The API key is valid' : 'The API key is invalid');
}

catch (err) {
  console.log(`An error occurred: ${err.message}`);
}
```
