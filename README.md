# Akismet for JS
![Runtime](https://img.shields.io/badge/node-%3E%3D10.13-brightgreen.svg) ![Release](https://img.shields.io/npm/v/@cedx/akismet.svg) ![License](https://img.shields.io/npm/l/@cedx/akismet.svg) ![Downloads](https://img.shields.io/npm/dt/@cedx/akismet.svg) ![Dependencies](https://david-dm.org/cedx/akismet.js.svg) ![Coverage](https://coveralls.io/repos/github/cedx/akismet.js/badge.svg) ![Build](https://travis-ci.com/cedx/akismet.js.svg)

Prevent comment spam using [Akismet](https://akismet.com) service,
in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) and [TypeScript](https://www.typescriptlang.org).

## Documentation
- [User guide](https://dev.belin.io/akismet.js)
- [API reference](https://dev.belin.io/akismet.js/api)

## Development
- [Git repository](https://git.belin.io/cedx/akismet.js)
- [npm package](https://www.npmjs.com/package/@cedx/akismet)
- [Submit an issue](https://git.belin.io/cedx/akismet.js/issues)

## Features
- [Key verification](https://akismet.com/development/api/#verify-key): checks an Akismet API key and gets a value indicating whether it is valid.
- [Comment check](https://akismet.com/development/api/#comment-check): checks a comment and gets a value indicating whether it is spam.
- [Submit spam](https://akismet.com/development/api/#submit-spam): submits a comment that was not marked as spam but should have been.
- [Submit ham](https://akismet.com/development/api/#submit-ham): submits a comment that was incorrectly marked as spam but should not have been.

## Usage

### Key verification

```ts
import {Blog, Client} from '@cedx/akismet';

try {
  const client = new Client('123YourAPIKey', new Blog(new URL('https://www.yourblog.com')));
  const isValid = await client.verifyKey();
  console.log(isValid ? 'The API key is valid' : 'The API key is invalid');
}

catch (err) {
  console.log(`An error occurred: ${err.message}`);
}
```

### Comment check

```ts
import {Author, Comment} from '@cedx/akismet';

try {
  const comment = new Comment(
    new Author('127.0.0.1', 'Mozilla/5.0'),
    {content: 'A user comment', date: Date.now()}
  );

  const isSpam = await client.checkComment(comment);
  console.log(isSpam ? 'The comment is spam' : 'The comment is ham');
}

catch (err) {
  console.log(`An error occurred: ${err.message}`);
}
```

### Submit spam / ham

```ts
try {
  await client.submitSpam(comment);
  console.log('Spam submitted');

  await client.submitHam(comment);
  console.log('Ham submitted');
}

catch (err) {
  console.log(`An error occurred: ${err.message}`);
}
```

## Events
The `Client` class is an [`EventEmitter`](https://nodejs.org/api/events.html) that triggers some events during its life cycle:

- `request` : emitted every time a request is made to the remote service.
- `response` : emitted every time a response is received from the remote service.

You can subscribe to them using the `on()` method:

```ts
client.on(Client.eventRequest, (request) =>
  console.log(`Client request: ${request.url}`)
);

client.on(Client.eventResponse, (request, response) =>
  console.log(`Server response: ${response.status}`)
);
```

## Unit tests
In order to run the tests, you must set the `AKISMET_API_KEY` environment variable to the value of your Akismet API key:

```shell
export AKISMET_API_KEY="<123YourAPIKey>"
```

Then, you can run the `test` script from the command prompt:

```shell
npm test
```

## License
[Akismet for JS](https://dev.belin.io/akismet.js) is distributed under the MIT License.
