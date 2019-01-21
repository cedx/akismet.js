const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  input: 'lib/index.js',
  output: {file: 'build/akismet.js', format: 'iife', name: 'Akismet'},
  plugins: [commonjs()]
};
