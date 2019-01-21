module.exports = config => config.set({
  browsers: ['ChromeHeadless'],
  files: ['src/**/*.ts', 'test/**/*.ts'],
  frameworks: ['mocha', 'karma-typescript'],
  karmaTypescriptConfig: {
    coverageOptions: {instrumentation: false},
    include: ['test/**/*.ts'],
    tsconfig: 'tsconfig.json'
  },
  preprocessors: {
    'src/**/*.ts': ['karma-typescript'],
    'test/**/*.ts': ['karma-typescript']
  },
  reporters: ['progress', 'karma-typescript'],
  singleRun: true
});
