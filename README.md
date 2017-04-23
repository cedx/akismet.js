# Akismet for JS
![Release](https://img.shields.io/npm/v/@cedx/akismet.svg) ![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg) ![Downloads](https://img.shields.io/npm/dt/@cedx/akismet.svg) ![Dependencies](https://david-dm.org/cedx/akismet.js.svg) ![Coverage](https://coveralls.io/repos/github/cedx/akismet.js/badge.svg) ![Build](https://travis-ci.org/cedx/akismet.js.svg)

Prevent comment spam using [Akismet](https://akismet.com) service, in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

## Features
- [Key verification](https://akismet.com/development/api/#verify-key): checks an Akismet API key and gets a value indicating whether it is valid.
- [Comment check](https://akismet.com/development/api/#comment-check): checks a comment and gets a value indicating whether it is spam.
- [Submit spam](https://akismet.com/development/api/#submit-spam): submits a comment that was not marked as spam but should have been.
- [Submit ham](https://akismet.com/development/api/#submit-ham): submits a comment that was incorrectly marked as spam but should not have been.

## Requirements
The latest [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com) versions.
If you plan to play with the sources, you will also need the latest [Gulp.js](http://gulpjs.com) version.

## Installing via [npm](https://www.npmjs.com)
From a command prompt, run:

```shell
$ npm install --save @cedx/akismet
```

## Usage

### Key verification

```javascript
const {Client} = require('@cedx/akismet');

try {
  let client = new Client('YourAPIKey', 'http://your.blog.url');
  let isValid = await client.verifyKey();
  console.log(isValid ? 'Your API key is valid.' : 'Your API key is invalid.');
}

catch (error) {
  console.log(`An error occurred: ${error}`);
}
```

### Comment check

```javascript
const {Author, Comment} = require('@cedx/akismet');

try {
  let comment = new Comment(
    new Author('127.0.0.1', 'Mozilla/5.0'),
    'A comment.'
  );

  let isSpam = await client.checkComment(comment);
  console.log(isSpam ? 'The comment is marked as spam.' : 'The comment is marked as ham.');
}

catch (error) {
  console.log(`An error occurred: ${error}`);
}
```

### Submit spam/ham

```javascript
try {
  await client.submitSpam(comment);
  console.log('Spam submitted.');
   
  await client.submitHam(comment);
  console.log('Ham submitted.');
}

catch (error) {
  console.log(`An error occurred: ${error}`);
}
```

## Events
The `Client` class is an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).
During its life cycle, it emits these events:

- `request` : emitted every time a request is made to the remote service.
- `response` : emitted every time a response is received from the remote service.

You can subscribe to them using the `on()` method:

```javascript
client.on('request', response => console.log(`Client request: ${request.url}`));
client.on('response', response => console.log(`Server response: ${response.statusCode}`));
```

## Unit tests
In order to run the tests, you must set the `AKISMET_API_KEY` environment variable to the value of your Akismet API key:

```shell
$ export AKISMET_API_KEY="<YourAPIKey>"
```

Then, you can run the `test` script from the command prompt:

```shell
$ npm test
```

## See also
- [API reference](https://cedx.github.io/akismet.js)
- [Code coverage](https://coveralls.io/github/cedx/akismet.js)
- [Continuous integration](https://travis-ci.org/cedx/akismet.js)

## License
[Akismet for JS](https://github.com/cedx/akismet.js) is distributed under the Apache License, version 2.0.
