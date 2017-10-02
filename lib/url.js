'use strict';

const isBrowser = typeof window == 'object' && typeof document == 'object' && document.nodeType == 9;
const {URL, URLSearchParams} = isBrowser ? window : require('url');

module.exports = {
  URL,
  URLSearchParams
};
