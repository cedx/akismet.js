const {normalize, resolve} = require('path');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

module.exports = config => config.set({
  basePath: resolve(__dirname, '..'),
  browsers: ['FirefoxHeadless'],
  files: [
    {pattern: 'lib/**/*.js', type: 'module'},
    {pattern: 'test/**/*.js', type: 'module'}
  ],
  frameworks: ['mocha'],
  preprocessors: {
    'test/**/*.js': ['rollup']
  },
  reporters: ['progress'],
  rollupPreprocessor: {
    onwarn: (warning, warn) => {
      if (warning.code == 'CIRCULAR_DEPENDENCY' && warning.importer.includes(normalize('node_modules/chai'))) return;
      warn(warning);
    },
    output: {format: 'iife', name: 'lcov'},
    plugins: [nodeResolve(), commonjs()]
  },
  singleRun: true
});
