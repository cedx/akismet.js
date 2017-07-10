# Akismet for JS
![Runtime](https://img.shields.io/badge/node-%3E%3D8.0-brightgreen.svg) ![Release](https://img.shields.io/npm/v/@cedx/akismet.svg) ![License](https://img.shields.io/npm/l/@cedx/akismet.svg) ![Downloads](https://img.shields.io/npm/dt/@cedx/akismet.svg) ![Dependencies](https://david-dm.org/cedx/akismet.js.svg) ![Coverage](https://coveralls.io/repos/github/cedx/akismet.js/badge.svg) ![Build](https://travis-ci.org/cedx/akismet.js.svg)

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
This package has an API based on [Observables](http://reactivex.io/intro.html).

### Key verification

```javascript
import {Client} from '@cedx/akismet';

let client = new Client('YourAPIKey', 'http://your.blog.url');
client.verifyKey().subscribe(isValid =>
  console.log(isValid ? 'Your API key is valid.' : 'Your API key is invalid.')
);
```

### Comment check

```javascript
import {Author, Comment} from '@cedx/akismet';

let comment = new Comment(
  new Author('127.0.0.1', 'Mozilla/5.0'),
  'A comment.'
);

client.checkComment(comment).subscribe(isSpam =>
  console.log(isSpam ? 'The comment is marked as spam.' : 'The comment is marked as ham.')
);
```

### Submit spam/ham

```javascript
client.submitSpam(comment).subscribe(() =>
  console.log('Spam submitted.')
);

client.submitHam(comment).subscribe(() =>
  console.log('Ham submitted.')
);
```

## Events
The `Client` class triggers some events during its life cycle:

- `request` : emitted every time a request is made to the remote service.
- `response` : emitted every time a response is received from the remote service.

These events are exposed as [Observable](http://reactivex.io/intro.html), you can subscribe to them using the `on<EventName>` properties:

```javascript
client.onRequest.subscribe(request =>
  console.log(`Client request: ${request.url}`)
);

client.onResponse.subscribe(response =>
  console.log(`Server response: ${response.statusCode}`)
);
```

## Promise support
If you require it, an `Observable` can be converted to a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) by using the `toPromise()` method:

```javascript
try {
  let isSpam = await client.checkComment(comment).toPromise();
  console.log(isSpam ? 'The comment is marked as spam.' : 'The comment is marked as ham.');
}

catch (error) {
  console.log(`An error occurred: ${error.message}`);
}
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
