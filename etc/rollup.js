import {join} from 'path';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: join(__dirname, '../lib/browser.mjs'),
  output: {file: join(__dirname, '../build/akismet.js'), format: 'iife', name: 'akismet'},
  plugins: [resolve(), commonjs({
    namedExports: {'node_modules/eventemitter3/index.js': ['EventEmitter']}
  })]
};
