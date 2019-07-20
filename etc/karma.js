const {resolve} = require('path');

module.exports = config => config.set({
  basePath: resolve(__dirname, '..'),
  browsers: ['FirefoxHeadless'],
  files: [
    {pattern: 'lib/**/*.js', type: 'module'},
    {pattern: 'test/**/*.js', type: 'module'}
  ],
  frameworks: ['mocha', 'chai'],
  reporters: ['progress'],
  singleRun: true
});
