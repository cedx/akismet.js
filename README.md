# Akismet for JS
![Release](https://img.shields.io/npm/v/@cedx/akismet.svg) ![License](https://img.shields.io/npm/l/@cedx/akismet.svg) ![Downloads](https://img.shields.io/npm/dt/@cedx/akismet.svg) ![Dependencies](https://img.shields.io/david/cedx/akismet.svg) ![Code quality](https://img.shields.io/codacy/grade/c11dd02fb6b24cdb80565f0181aaa583.svg) ![Build](https://img.shields.io/travis/cedx/akismet.svg)

Prevent comment spam using [Akismet](https://akismet.com) service, in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

## Features
- [Key Verification](https://akismet.com/development/api/#verify-key): checks an Akismet API key and gets a value indicating whether it is valid.
- [Comment Check](https://akismet.com/development/api/#comment-check): checks a comment and gets a value indicating whether it is spam.
- [Submit Spam](https://akismet.com/development/api/#submit-spam): submits a comment that was not marked as spam but should have been.
- [Submit Ham](https://akismet.com/development/api/#submit-ham): submits a comment that was incorrectly marked as spam but should not have been.

## Requirements
The latest [Node.js](https://nodejs.org) and [NPM](https://www.npmjs.com) versions.
If you plan to play with the sources, you will also need the [Gulp.js](http://gulpjs.com/) latest version.

## Installing via [npm](https://www.npmjs.com)
From a command prompt, run:

```shell
$ npm install --save @cedx/akismet
```

## Usage
This package has an API based on [Observables](http://reactivex.io/intro.html).

### Key Verification

```javascript
const {Client} = require('@cedx/akismet');

let client = new Client('YourAPIKey', 'http://your.blog.url');
client.verifyKey().subscribe(isValid =>
  console.log(isValid ? 'Your API key is valid.' : 'Your API key is invalid.')
);
```

### Comment Check

```javascript
const {Author, Comment} = require('@cedx/akismet');

let comment = new Comment({
  author: new Author({ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0'}),
  content: 'A comment.'
});

client.checkComment(comment).subscribe(isSpam =>
  console.log(isSpam ? 'The comment is marked as spam.' : 'The comment is marked as ham.')
);
```

### Submit Spam/Ham

```javascript
client.submitSpam(comment).subscribe(() =>
  console.log('Spam submitted.')
);

client.submitHam(comment).subscribe(() =>
  console.log('Ham submitted.')
);
```

## Promise Support
If you require it, an `Observable` can be converted to a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) by using the `toPromise()` method:

```javascript
let promise = client.checkComment(comment).toPromise();
promise.then(isSpam =>
  console.log(isSpam ? 'The comment is marked as spam.' : 'The comment is marked as ham.')
);
```

## Unit Tests
In order to run the tests, you must set one or several environment variables:

- `AKISMET_API_KEY`: the Akismet API key (required).
- `AKISMET_BLOG`: the front page or home URL (optional).
- `AKISMET_SERVICE_URL`: the URL of the remote service (optional).

Then, you can run the `test` script from the command prompt:

```shell
$ npm test
```

## See Also
- [API Reference](http://dev.belin.io/akismet)
- [Code Quality](https://www.codacy.com/app/cedx/akismet)
- [Continuous Integration](https://travis-ci.org/cedx/akismet)

## License
[Akismet for JS](https://github.com/cedx/akismet) is distributed under the Apache License, version 2.0.
