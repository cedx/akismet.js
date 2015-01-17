# Changelog
This file contains highlights of what changes on each version of the [Akismet.js](https://www.npmjs.com/package/akismet-js) library.

#### Version 0.3.5
- Using [Gulp.js](http://gulpjs.com) as build system.

#### Version 0.3.4
- CORS headers handling delegated to [`cors`](https://www.npmjs.com/package/cors) module.

#### Version 0.3.3
- Updated the package dependencies.

#### Version 0.3.2
- Lowered the required version of Node.js runtime.

#### Version 0.3.1
- Fixed bugs in server implementation: bad error handling.

#### Version 0.3.0
- Added `Blog` class to support the latest Akismet APIs.

#### Version 0.2.1
- Fixed bugs in server implementation: bad parsing of client requests.

#### Version 0.2.0
- Added client implementation based on [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).
- Added server implementation used to proxy requests from HTML clients to [Akismet](https://akismet.com) service.

#### Version 0.1.0
- Initial release: client implementation based on [`http.request`](http://nodejs.org/api/http.html#http_http_request_options_callback).
