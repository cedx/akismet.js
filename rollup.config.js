import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'lib/browser.mjs',
  output: {file: 'build/akismet.js', format: 'iife', name: 'akismet'},
  plugins: [resolve(), commonjs({
    namedExports: {'node_modules/eventemitter3/index.js': ['EventEmitter']}
  })]
};
