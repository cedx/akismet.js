'use strict';

/* eslint-disable no-new-func */
const isBrowser = new Function('try { return this === window; } catch (e) { return false; }');
/* eslint-enable no-new-func */

/**
 * A reference to the isomorphic `URL` constructor.
 * @type {URL}
 */
exports.URL = isBrowser() ? window.URL : require('url').URL;
