const {join} = require('path');
const sources = {
  lib: join(__dirname, '../src/**/*.ts'),
  test: join(__dirname, '**/*_test.ts')
};

module.exports = config => config.set({
  browsers: ['FirefoxHeadless'],
  files: [sources.lib, sources.test],
  frameworks: ['mocha', 'karma-typescript'],
  karmaTypescriptConfig: {
    coverageOptions: {instrumentation: false},
    include: [sources.test],
    tsconfig: '../tsconfig.json'
  },
  plugins: [
    require('karma-firefox-launcher'),
    require('karma-mocha'),
    require('karma-typescript')
  ],
  preprocessors: {
    [sources.lib]: ['karma-typescript'],
    [sources.test]: ['karma-typescript']
  },
  reporters: ['progress'],
  singleRun: true
});
