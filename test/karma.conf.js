module.exports = config => config.set({
  browsers: ['FirefoxHeadless'],
  files: ['**/*_test.ts', '../src/**/*.ts'],
  frameworks: ['mocha', 'karma-typescript'],
  karmaTypescriptConfig: {
    coverageOptions: {instrumentation: false},
    include: ['**/*_test.ts'],
    tsconfig: '../tsconfig.json'
  },
  plugins: [
    require('karma-firefox-launcher'),
    require('karma-mocha'),
    require('karma-typescript')
  ],
  preprocessors: {
    '**/*_test.ts': ['karma-typescript'],
    '../src/**/*.ts': ['karma-typescript']
  },
  reporters: ['progress'],
  singleRun: true
});
