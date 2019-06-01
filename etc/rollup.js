import {resolve} from 'path';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: resolve(__dirname, '../lib/browser.js'),
  output: {
    file: resolve(__dirname, '../build/akismet.js'),
    format: 'iife',
    name: 'akismet'
  },
  plugins: [
    nodeResolve(),
    commonjs()
  ]
};
