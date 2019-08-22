import {resolve} from 'path';

export default {
  input: resolve(__dirname, '../lib/browser.js'),
  output: {
    file: resolve(__dirname, '../build/akismet.js'),
    format: 'iife',
    name: 'akismet'
  }
};
