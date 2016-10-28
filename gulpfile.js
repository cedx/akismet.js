/**
 * Build system.
 */
'use strict';

const browserify = require('browserify');
const child = require('child_process');
const del = require('del');
const express = require('express');
const fs = require('fs');
const gulp = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const os = require('os');
const path = require('path');
const pkg = require('./package.json');

/**
 * The task settings.
 * @type {object}
 */
const config = {
  output: `${pkg.name}-${pkg.version}.zip`,
  sources: ['akismet.js', '*.json', '*.md', '*.txt', 'bin/*.js', 'lib/*.js']
};

/**
 * The build environment.
 * @type {string}
 */
const environment = 'NODE_ENV' in process.env ? process.env.NODE_ENV : 'development';

/**
 * The task plugins.
 * @type {object}
 */
const plugins = loadPlugins({
  pattern: ['gulp-*', '@*/gulp-*', 'vinyl-*'],
  replaceString: /^(gulp|vinyl)-/
});

/**
 * Runs the default tasks.
 */
gulp.task('default', ['build']);

/**
 * Builds the sources.
 */
gulp.task('build', () => gulp.src('src/**/*.js')
  .pipe(plugins.babel())
  .pipe(gulp.dest('lib'))
);

/**
 * Checks the package dependencies.
 */
gulp.task('check', () => {
  const {david} = plugins.cedx.david;
  return gulp.src('package.json').pipe(david()).on('error', function(err) {
    console.error(err);
    this.emit('end');
  });
});

/**
 * Deletes all generated files and reset any saved state.
 */
gulp.task('clean', () =>
  del(['var/**/*', `${os.homedir()}/.forever/akismet.log`])
);

/**
 * Sends the results of the code coverage.
 */
gulp.task('coverage', ['test'], () => {
  let command = path.join('node_modules/.bin', process.platform == 'win32' ? 'codacy-coverage.cmd' : 'codacy-coverage');
  return _exec(`${command} < var/lcov.info`);
});

/**
 * Creates a distribution file for this program.
 */
gulp.task('dist', ['default'], () => gulp.src(config.sources, {base: '.'})
  .pipe(plugins.zip(config.output))
  .pipe(gulp.dest('var'))
);

/**
 * Builds the documentation.
 */
gulp.task('doc', () => {
  let command = path.join('node_modules/.bin', process.platform == 'win32' ? 'esdoc.cmd' : 'esdoc');
  return del('doc/api').then(() => _exec(`${command} -c doc/esdoc.json`));
});

/**
 * Fixes the coding standards issues.
 */
gulp.task('fix', () => gulp.src(['*.js', 'src/**/*.js', 'test/**/*.js'], {base: '.'})
  .pipe(plugins.eslint({fix: true}))
  .pipe(gulp.dest('.'))
);

/**
 * Performs static analysis of source code.
 */
gulp.task('lint', () => gulp.src(['*.js', 'src/**/*.js', 'test/**/*.js'])
  .pipe(plugins.eslint())
  .pipe(plugins.eslint.format())
  .pipe(plugins.eslint.failAfterError())
);

/**
 * Starts the Akismet server.
 */
gulp.task('serve', () => {
  if ('_server' in global) global._server.kill();
  global._server = child.fork('bin/cli.js');
  return Promise.resolve();
});

/**
 * Runs the unit tests.
 */
gulp.task('test', ['test:instrument'], () => gulp.src(['test/**/*.js'], {read: false})
  .pipe(plugins.mocha())
  .pipe(plugins.istanbul.writeReports({dir: 'var', reporters: ['lcovonly']}))
);

gulp.task('test:env', () =>
  'AKISMET_API_KEY' in process.env ? Promise.resolve() : Promise.reject(new Error('AKISMET_API_KEY environment variable not set.'))
);

gulp.task('test:instrument', ['test:setup'], () => gulp.src(['src/**/*.js'])
  .pipe(plugins.istanbul({instrumenter: require('isparta').Instrumenter}))
  .pipe(plugins.istanbul.hookRequire())
);

gulp.task('test:setup', ['test:env'], () => new Promise(resolve => {
  process.env.BABEL_DISABLE_CACHE = process.platform == 'win32' ? '0' : '1';
  require('babel-register');
  resolve();
}));

/**
 * Runs a command and prints its output.
 * @param {string} command The command to run, with space-separated arguments.
 * @param {object} [options] The settings to customize how the process is spawned.
 * @return {Promise<string>} The command output when it is finally terminated.
 */
function _exec(command, options = {}) {
  return new Promise((resolve, reject) => child.exec(command, options, (err, stdout) => {
    if (err) reject(err);
    else resolve(stdout.trim());
  }));
}
