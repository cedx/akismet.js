# Changelog

## Version [13.1.0](https://github.com/cedx/akismet.js/compare/v13.0.1...v13.1.0)
- Added a user guide based on [MkDocs](http://www.mkdocs.org).
- Added the `ClientError` class.
- Updated the build system to [Gulp](https://gulpjs.com) version 4.
- Updated the package dependencies.

## Version [13.0.1](https://github.com/cedx/akismet.js/compare/v12.0.0...v13.0.1)
- Breaking change: changed the signature of the `Client` events.
- Updated the package dependencies.

## Version [12.0.0](https://github.com/cedx/akismet.js/compare/v11.0.0...v12.0.0)
- Breaking change: changed the signature of most class constructors.
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: removed the `toJSON()` and `toString()` methods from the `Client` class.
- Breaking change: using camel case instead of studly caps for static properties.
- Added new values to the `CommentType` enumeration.
- Updated the package dependencies.

## Version [11.0.0](https://github.com/cedx/akismet.js/compare/v10.1.0...v11.0.0)
- Breaking change: converted the [`Observable`](http://reactivex.io/intro.html)-based API to an `async/await`-based one.
- Breaking change: converted the `Subject` event API to the [`EventEmitter`](https://nodejs.org/api/events.html) one.
- Added the [`#[Symbol.toStringTag]`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag) property to all classes.
- Changed licensing for the [MIT License](https://opensource.org/licenses/MIT).

## Version [10.1.0](https://github.com/cedx/akismet.js/compare/v10.0.0...v10.1.0)
- Replaced the [SuperAgent](https://visionmedia.github.io/superagent) HTTP client by `node-fetch`.
- Updated the package dependencies.

## Version [10.0.0](https://github.com/cedx/akismet.js/compare/v9.1.0...v10.0.0)
- Breaking change: renamed the `fromJSON()` static methods to `fromJson`.
- Changed the naming convention: acronyms and abbreviations are capitalized like regular words, except for two-letter acronyms.
- Updated the package dependencies.

## Version [9.1.0](https://github.com/cedx/akismet.js/compare/v9.0.0...v9.1.0)
- Removed the dependency on [Babel](https://babeljs.io) compiler.
- Updated the package dependencies.

## Version [9.0.0](https://github.com/cedx/akismet.js/compare/v8.0.1...v9.0.0)
- Breaking change: reverted the API of the `Client` class to an [Observable](http://reactivex.io/intro.html)-based one.
- Added new unit tests.
- Updated the package dependencies.

## Version [8.0.1](https://github.com/cedx/akismet.js/compare/v8.0.0...v8.0.1)
- Fixed a code generation bug.
- Updated the package dependencies.

## Version [8.0.0](https://github.com/cedx/akismet.js/compare/v7.1.0...v8.0.0)
- Breaking change: properties representing URLs as strings now use instances of the [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) class.
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Updated the package dependencies.

## Version [7.1.0](https://github.com/cedx/akismet.js/compare/v7.0.0...v7.1.0)
- Added support for the [Node Security Platform](https://nodesecurity.io) reports.
- Updated the package dependencies.

## Version [7.0.0](https://github.com/cedx/akismet.js/compare/v6.2.0...v7.0.0)
- Breaking change: dropped the dependency on [Observables](http://reactivex.io/intro.html).
- Breaking change: the `Client` class is now an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).

## Version [6.2.0](https://github.com/cedx/akismet.js/compare/v6.1.0...v6.2.0)
- Updated the package dependencies.

## Version [6.1.0](https://github.com/cedx/akismet.js/compare/v6.0.0...v6.1.0)
- Removed the dependency on the `@cedx/enum` module.
- Removed the dependency on the `gulp-load-plugins` module.

## Version [6.0.0](https://github.com/cedx/akismet.js/compare/v5.0.0...v6.0.0)
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: using ES2017 features, like async/await functions.
- Improved the build system.
- Ported the unit test assertions from [TDD](https://en.wikipedia.org/wiki/Test-driven_development) to [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development).
- Updated the package dependencies.

## Version [5.0.0](https://github.com/cedx/akismet.js/compare/v4.0.0...v5.0.0)
- Breaking change: changed the signature of all constructors.
- Breaking change: changed the return type of several `Client` methods.
- Breaking change: renamed the `Client.SERVICE_URL` constant to `defaultEndPoint`.
- Added the `Client.endPoint` property.
- Updated the package dependencies.

## Version [4.0.0](https://github.com/cedx/akismet.js/compare/v3.4.0...v4.0.0)
- Breaking change: changed the `Blog.language` string property for the `languages` array property.
- Breaking change: reverted the `Client.test` property to `isTest`.
- Removed the `v` prefix from the Node.js version number in the `Client.userAgent` property.
- Removed the `dist` build task.
- Updated the package dependencies.

## Version [3.4.0](https://github.com/cedx/akismet.js/compare/v3.3.0...v3.4.0)
- Replaced the [Codacy](https://www.codacy.com) code coverage service by the [Coveralls](https://coveralls.io) one.
- Updated the package dependencies.

## Version [3.3.0](https://github.com/cedx/akismet.js/compare/v3.2.0...v3.3.0)
- Added the `onRequest` and `onResponse` event streams to the `Client` class.

## Version [3.2.0](https://github.com/cedx/akismet.js/compare/v3.1.0...v3.2.0)
- Updated the [SuperAgent](https://visionmedia.github.io/superagent) dependency.

## Version [3.1.0](https://github.com/cedx/akismet.js/compare/v3.0.0...v3.1.0)
- Allowing to set dates as timestamps or strings in the `Comment` constructor.

## Version [3.0.0](https://github.com/cedx/akismet.js/compare/v2.0.1...v3.0.0)
- Breaking change: modified the signature of the constructor of the `Client` class.
- Breaking change: renamed the `Client.isTest` property to `test`.
- Added the `Client.debugHeader` property.
- Added the `Client.toJSON()` method.

## Version [2.0.1](https://github.com/cedx/akismet.js/compare/v2.0.0...v2.0.1)
- Added a dedicated enumeration API to the `CommentType` type.

## Version [2.0.0](https://github.com/cedx/akismet.js/compare/v1.0.1...v2.0.0)
- Breaking change: removed the `Client.serviceURL` property.
- Breaking change: removed the `EndPoints` enumeration.
- Breaking change: renamed the `Client.DEFAULT_SERVICE` property to `SERVICE_URL`.
- Updated the package dependencies.
- Updated the project URL.

## Version [1.0.1](https://github.com/cedx/akismet.js/compare/v1.0.0...v1.0.1)
- Fixed [issue #5](https://github.com/cedx/akismet.js/issues/5).

## Version [1.0.0](https://github.com/cedx/akismet.js/compare/v0.9.0...v1.0.0)
- Breaking change: changed the signature of the `fromJSON` methods.
- Breaking change: dropped the embedded server and the command line interface.
- Breaking change: ported the [CommonJS](https://nodejs.org/api/modules.html) modules to ES2015 format.
- Breaking change: ported the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-based APIs to [Observables](http://reactivex.io/intro.html).
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: removed the `url` parameter from the `Blog` constructor.
- Breaking change: removed the `HTTPHeaders` enumeration.
- Added a build task for fixing the coding standards issues.
- Replaced [JSDoc](http://usejsdoc.org) documentation generator by [ESDoc](https://esdoc.org).
- Replaced [JSHint](http://jshint.com) linter by [ESLint](http://eslint.org).
- Replaced the test classes by plain tests.
- Updated the package dependencies.

## Version [0.9.0](https://github.com/cedx/akismet.js/compare/v0.8.0...v0.9.0)
- Breaking change: renamed the `Server.DEFAULT_HOST` property to `DEFAULT_ADDRESS`.
- Breaking change: renamed the `Server.host` property to `address`.
- Breaking change: renamed the `-H, --host` command line option to `-a, --address`.
- Upgraded the package dependencies.

## Version [0.8.0](https://github.com/cedx/akismet.js/compare/v0.7.1...v0.8.0)
- Breaking change: using more ES2015 features, like default parameters and destructuring assignment.
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: fixed the signature and behavior of the `toJSON()` methods.
- Breaking change: changed the case of the `Client.serviceUrl` and `Server.redirectUrl` properties.
- Turned the package into a [scoped one](https://docs.npmjs.com/getting-started/scoped-packages).
- Added the `DEFAULT_HOST` and `DEFAULT_PORT` constants to the `Server` class.
- Added more unit tests.
- Replaced [SonarQube](http://www.sonarqube.org) code analyzer by [Codacy](https://www.codacy.com) service.
- Improved the code coverage.

## Version [0.7.1](https://github.com/cedx/akismet.js/compare/v0.7.0...v0.7.1)
- Added a command line option to set the user to drop privileges to once server socket is bound.
- Fixed [issue #4](https://github.com/cedx/akismet.js/issues/4): properly handle the `host` and `port` command line arguments.
- Upgraded the package dependencies.

## Version [0.7.0](https://github.com/cedx/akismet.js/compare/v0.6.2...v0.7.0)
- Breaking change: using ES2015 features, like arrow functions, block-scoped binding constructs, classes and template strings.
- Breaking change: raised the required [Node.js](http://nodejs.org) version.
- Breaking change: the `Server` class is not exposed anymore by the default exports.
- Breaking change: `Application._log` method renamed to `log`.
- The `port` parameter of `Server.listen()` method is now optional.
- Improved browser integration.
- Added support for code coverage.
- Added support for [SonarQube](http://www.sonarqube.org) code analyzer.
- Added support for [Travis CI](https://travis-ci.org) continuous integration.
- Changed the documentation system for [JSDoc](http://usejsdoc.org).
- Changed licensing for the [Apache License Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

## Version [0.6.2](https://github.com/cedx/akismet.js/compare/v0.6.1...v0.6.2)
- Fixed a bug in `Comment.toJSON` method.

## Version [0.6.1](https://github.com/cedx/akismet.js/compare/v0.6.0...v0.6.1)
- Fixed the usage of `Author.role` property.
- Fixed the usage of `Client.isTest` property.
- Fixed a unit test.

## Version [0.6.0](https://github.com/cedx/akismet.js/compare/v0.5.1...v0.6.0)
- Added `role` property to `Author` class.
- Added `isTest` property to `Client` class.
- Added `date` and `postModified` properties to `Comment` class.

## Version [0.5.2](https://github.com/cedx/akismet.js/compare/v0.5.1...v0.5.2)
- Upgraded the package dependencies.

## Version [0.5.1](https://github.com/cedx/akismet.js/compare/v0.5.0...v0.5.1)
- Upgraded the package dependencies.

## Version [0.5.0](https://github.com/cedx/akismet.js/compare/v0.4.1...v0.5.0)
- Raised the required [Node.js](http://nodejs.org) version.
- Removed the dependency on [`promise`](https://www.npmjs.com/package/promise) module.
- Upgraded the package dependencies.
- Fixed [issue #3](https://github.com/cedx/akismet.js/issues/3): returning a `Promise` in `Server.checkComment` method.

## Version [0.4.1](https://github.com/cedx/akismet.js/compare/v0.4.0...v0.4.1)
- Fixed [issue #2](https://github.com/cedx/akismet.js/issues/2): using a Unix system for publishing the package on [npm](https://www.npmjs.com).

## Version [0.4.0](https://github.com/cedx/akismet.js/compare/v0.3.5...v0.4.0)
- Breaking change: ported the callback-based API to [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

## Version [0.3.5](https://github.com/cedx/akismet.js/compare/v0.3.4...v0.3.5)
- Using [Gulp](https://gulpjs.com) as build system.

## Version [0.3.4](https://github.com/cedx/akismet.js/compare/v0.3.3...v0.3.4)
- CORS headers handling delegated to [`cors`](https://www.npmjs.com/package/cors) module.

## Version [0.3.3](https://github.com/cedx/akismet.js/compare/v0.3.2...v0.3.3)
- Upgraded the package dependencies.

## Version [0.3.2](https://github.com/cedx/akismet.js/compare/v0.3.1...v0.3.2)
- Lowered the required [Node.js](http://nodejs.org) version.

## Version [0.3.1](https://github.com/cedx/akismet.js/compare/v0.3.0...v0.3.1)
- Fixed bugs in server implementation: bad error handling.

## Version [0.3.0](https://github.com/cedx/akismet.js/compare/v0.2.1...v0.3.0)
- Added `Blog` class to support the latest [Akismet](https://akismet.com) APIs.

## Version [0.2.1](https://github.com/cedx/akismet.js/compare/v0.2.0...v0.2.1)
- Fixed bugs in server implementation: bad parsing of client requests.

## Version [0.2.0](https://github.com/cedx/akismet.js/compare/v0.1.0...v0.2.0)
- Added client implementation based on [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).
- Added server implementation used to proxy requests from HTML clients to [Akismet](https://akismet.com) service.

## Version 0.1.0
- Initial release: client implementation based on [`http.request`](http://nodejs.org/api/http.html#http_http_request_options_callback).
