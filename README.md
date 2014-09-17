# Akismet.js
Prevent comment spam using [Akismet](https://akismet.com) service, in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

## Features
- [Key verification](https://akismet.com/development/api/#verify-key): checks an Akismet API key and gets a value indicating whether it is valid.
- [Comment check](https://akismet.com/development/api/#comment-check): checks a comment and gets a value indicating whether it is spam.
- [Submit spam](https://akismet.com/development/api/#submit-spam): submits a comment that was not marked as spam but should have been.
- [Submit ham](https://akismet.com/development/api/#submit-ham): submits a comment that was incorrectly marked as spam but should not have been.

## Documentation
- [API Reference](http://dev.belin.io/akismet.js/api)

## Installing via [npm](https://www.npmjs.org)

#### 1. Depend on it
Add this to your project's `package.json` file:

```json
{
  "dependencies": {
    "akismet-js": "*"
  }
}
```

#### 2. Install it
From the command line, run:

```shell
$ npm install
```

#### 3. Import it
Now in your JavaScript code, you can use:

```javascript
var akismet = require('akismet-js');
```

## Usage

#### Key Verification

```javascript
var client = new akismet.Client('123YourAPIKey', 'http://your.blog.url');
client.verifyKey(function(error, isValid) {
  console.log(isValid ? 'Your API key is valid.' : 'Your API key is invalid.');
});
```

#### Comment Check

```javascript
var comment = new akismet.Comment({
  author: new akismet.Author({ name: 'An author' }),
  content: 'A comment.'
});

client.checkComment(comment, function(error, isSpam) {
  console.log(isSpam ? 'The comment is marked as spam.' : 'The comment is marked as ham.');
});
```

#### Submit Spam/Ham

```javascript
client.submitSpam(comment, function(error) {
  console.log('Spam submitted.');
});

client.submitHam(comment, function(error) {
  console.log('Ham submitted.');
});
```

## Implementations

#### Client
The Akismet client comes in two flavors: a first one based on [`http.request`](http://nodejs.org/api/http.html#http_http_request_options_callback)
for server/console applications, and a second one based on [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
for client/browser applications.

Their usage is the same, but the HTML client is limited by security restrictions in a browser context.
Unfortunately, the [Akismet](https://akismet.com) service does not support [CORS](http://www.w3.org/TR/cors) headers.
So, the HTML client can't be used directly with the official service.

#### Server
To be able to use the HTML client, we must rely on a proxy server adding [CORS](http://www.w3.org/TR/cors) headers to service responses.

This is why a [server implementation](https://github.com/cedx/akismet.js/blob/master/lib/server.js) is provided with this package.
To facilitate its usage, a [command line interface](https://github.com/cedx/akismet.js/blob/master/bin/cli.js) is available in the `bin` folder.

From a command prompt, run the `cli.js` script (aliased as `akismet` by [npm](https://www.npmjs.org)):

```
$ node bin/cli.js --help

  Usage: akismet [options]

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    -p, --port <port>     port that the server should run on [3000]
    -h, --host <host>     host that the server should run on [0.0.0.0]
    -r, --redirect <url>  the URL to redirect when a request is unhandled
    --silent              silence the log output from the server
```

## License
[Akismet.js](https://www.npmjs.org/package/akismet-js) is distributed under the MIT License.
