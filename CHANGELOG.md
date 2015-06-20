# Changelog
This file contains highlights of what changes on each version of the [Akismet.js](https://www.npmjs.com/package/akismet-js) library.

#### Version 0.6.1
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
- Fixed [GitHub issue #3](https://github.com/cedx/akismet.js/issues/3): returning a `Promise` in `Server.checkComment` method.

#### Version 0.4.1
- Fixed [GitHub issue #2](https://github.com/cedx/akismet.js/issues/2): using a Unix system for publishing the package on [npm](https://www.npmjs.com).

#### Version 0.4.0
- Breaking change: ported the callback-based API to [Promises/A+](https://www.promisejs.org).

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
