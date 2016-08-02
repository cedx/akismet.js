# Changelog
This file contains highlights of what changes on each version of the [Akismet](https://github.com/cedx/akismet) library.

#### Version 0.8.0
- Breaking change: using more ES2015 features, like default parameters and destructuring assignment.
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Turned the package into a [scoped one](https://docs.npmjs.com/getting-started/scoped-packages).
- Added the `DEFAULT_HOST` and `DEFAULT_PORT` constants to the `Server` class.
- Replaced [SonarQube](http://www.sonarqube.org) code analyzer by [Codacy](https://www.codacy.com) service.

#### Version 0.7.2
- Upgraded the package dependencies.

#### Version 0.7.1
- Added a command line option to set the user to drop privileges to once server socket is bound.
- Fixed [issue #4](https://github.com/cedx/akismet/issues/4): properly handle the `host` and `port` command line arguments.
- Upgraded the package dependencies.

#### Version 0.7.0
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

#### Version 0.6.2
- Fixed a bug in `Comment.toJSON` method.

#### Version 0.6.1
- Fixed the usage of `Author.role` property.
- Fixed the usage of `Client.isTest` property.
- Fixed a unit test.

#### Version 0.6.0
- Added `role` property to `Author` class.
- Added `isTest` property to `Client` class.
- Added `date` and `postModified` properties to `Comment` class.

#### Version 0.5.2
- Upgraded the package dependencies.

#### Version 0.5.1
- Upgraded the package dependencies.

#### Version 0.5.0
- Raised the required [Node.js](http://nodejs.org) version.
- Removed the dependency on [`promise`](https://www.npmjs.com/package/promise) module.
- Upgraded the package dependencies.
- Fixed [issue #3](https://github.com/cedx/akismet/issues/3): returning a `Promise` in `Server.checkComment` method.

#### Version 0.4.1
- Fixed [issue #2](https://github.com/cedx/akismet/issues/2): using a Unix system for publishing the package on [npm](https://www.npmjs.com).

#### Version 0.4.0
- Breaking change: ported the callback-based API to [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

#### Version 0.3.5
- Using [Gulp.js](http://gulpjs.com) as build system.

#### Version 0.3.4
- CORS headers handling delegated to [`cors`](https://www.npmjs.com/package/cors) module.

#### Version 0.3.3
- Upgraded the package dependencies.

#### Version 0.3.2
- Lowered the required [Node.js](http://nodejs.org) version.

#### Version 0.3.1
- Fixed bugs in server implementation: bad error handling.

#### Version 0.3.0
- Added `Blog` class to support the latest [Akismet](https://akismet.com) APIs.

#### Version 0.2.1
- Fixed bugs in server implementation: bad parsing of client requests.

#### Version 0.2.0
- Added client implementation based on [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).
- Added server implementation used to proxy requests from HTML clients to [Akismet](https://akismet.com) service.

#### Version 0.1.0
- Initial release: client implementation based on [`http.request`](http://nodejs.org/api/http.html#http_http_request_options_callback).
