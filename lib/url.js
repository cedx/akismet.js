'use strict';

/* eslint-disable no-new-func */
const isBrowser = new Function('try { return this === window; } catch (e) { return false; }');
/* eslint-enable no-new-func */

if (isBrowser()) {
  exports.URL = window.URL;
  exports.URLSearchParams = window.URLSearchParams;
}
else {
  const {URL, URLSearchParams} = require('url');
  exports.URL = URL;
  exports.URLSearchParams = URLSearchParams;
}
