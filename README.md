# Akismet for JS
![Release](http://img.shields.io/npm/v/@cedx/akismet.svg) ![License](http://img.shields.io/npm/l/@cedx/akismet.svg) ![Downloads](http://img.shields.io/npm/dt/@cedx/akismet.svg) ![Dependencies](http://img.shields.io/david/cedx/akismet.svg) ![Build](http://img.shields.io/travis/cedx/akismet.svg)

Prevent comment spam using [Akismet](https://akismet.com) service, in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

## Features
- [Key Verification](https://akismet.com/development/api/#verify-key): checks an Akismet API key and gets a value indicating whether it is valid.
- [Comment Check](https://akismet.com/development/api/#comment-check): checks a comment and gets a value indicating whether it is spam.
- [Submit Spam](https://akismet.com/development/api/#submit-spam): submits a comment that was not marked as spam but should have been.
- [Submit Ham](https://akismet.com/development/api/#submit-ham): submits a comment that was incorrectly marked as spam but should not have been.

## Installing via [npm](https://www.npmjs.com)
From a command prompt, run:

```shell
$ npm install akismet --save
```

If you use CommonJS modules (e.g. [Node.js](https://nodejs.org) or [Browserify](http://browserify.org)), load the library as usual:

```javascript
const akismet = require('@cedx/akismet');
```

If you simply use Web pages, add a `<script>` tag to load the library:

```html
<script src="/node_modules/akismet/akismet.js"></script>
<script>
  const akismet = window.cedx.akismet;
</script>
```

## Usage
This package has an API based on [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

#### Key Verification

```javascript
let client = new akismet.Client('YourAPIKey', 'http://your.blog.url');
client.verifyKey().then(isValid =>
  console.log(isValid ? 'Your API key is valid.' : 'Your API key is invalid.')
);
```

#### Comment Check

```javascript
let comment = new akismet.Comment({
  author: new akismet.Author({ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0'}),
  content: 'A comment.'
});

client.checkComment(comment).then(isSpam =>
  console.log(isSpam ? 'The comment is marked as spam.' : 'The comment is marked as ham.')
);
```

#### Submit Spam/Ham

```javascript
client.submitSpam(comment).then(() =>
  console.log('Spam submitted.')
);

client.submitHam(comment).then(() =>
  console.log('Ham submitted.')
);
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

This is why a [server implementation](https://github.com/cedx/akismet/blob/master/lib/server.js) is provided within this package.
Unlike the other package classes, the `Server` class must be required explicitly if you want to use it in your own code:

```javascript
const {Server} = require('@cedx/akismet/lib/server');
new Server().listen(8080);
```

To facilitate its usage, a [command line interface](https://github.com/cedx/akismet/blob/master/bin/cli.js) is available in the `bin` folder.
From a command prompt, run the `cli.js` script (aliased as `akismet` by [npm](https://www.npmjs.com)):

```
$ node bin/cli.js --help

  Usage: akismet [options]

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    -p, --port <port>     port that the server should run on [3000]
    -H, --host <host>     host that the server should run on [0.0.0.0]
    -r, --redirect <url>  the URL to redirect when a request is unhandled
    -u, --user <user>     user to drop privileges to once server socket is bound
    --silent              silence the log output from the server
```

## Unit Tests

#### Browser
To test the client/browser implementation, launch a server instance, and points your browser to this link:  
[Unit Tests of HTML Client](https://www.belin.io/akismet)

#### Console
To test the server/console implementation, you must set one or several environment variables prior to running the tests:

- `AKISMET_API_KEY`: the Akismet API key (required).
- `AKISMET_BLOG`: the front page or home URL (optional).
- `AKISMET_SERVICE_URL`: the URL of the remote service (optional).

Then, run the `test` build task from the command prompt:

```shell
$ gulp test
```

## See Also
- [Code Quality](http://src.belin.io/dashboard/index/akismet)
- [Continuous Integration](https://travis-ci.org/cedx/akismet)

## License
[Akismet for JS](https://github.com/cedx/akismet) is distributed under the Apache License, version 2.0.
