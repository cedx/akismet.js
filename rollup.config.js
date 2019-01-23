const resolve = require('rollup-plugin-node-resolve');
module.exports = {
  input: 'lib/browser.mjs',
  output: {file: 'build/akismet.js', format: 'iife', name: 'akismet'},
  plugins: [resolve()]
};
