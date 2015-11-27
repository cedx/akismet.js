/**
 * Build system.
 * @module gulpfile
 */
'use strict';

// Module dependencies.
const browserify=require('browserify');
const child=require('child_process');
const del=require('del');
const fs=require('fs');
const gulp=require('gulp');
const loadPlugins=require('gulp-load-plugins');
const pkg=require('./package.json');

/**
 * The task settings.
 * @var {object}
 */
const config={
  output:
    `${pkg.name}-${pkg.version}.zip`,
  sources: [
    '*.json',
    '*.md',
    '*.txt',
    'index.js',
    'bin/*',
    'lib/*.js',
    'test/*.js',
    'www/**/*',
    '!www/**.map'
  ]
};

/**
 * The task plugins.
 * @var {object}
 */
const plugins=loadPlugins({
  pattern: ['gulp-*', 'vinyl-*'],
  replaceString: /^(gulp|vinyl)-/
});

/**
 * Runs the default tasks.
 */
gulp.task('default', ['css', 'js']);

/**
 * Checks the package dependencies.
 */
gulp.task('check', () => gulp.src('package.json')
  .pipe(plugins.david())
  .pipe(plugins.david.reporter));

/**
 * Deletes all generated files and reset any saved state.
 */
gulp.task('clean', callback =>
  del([`var/${config.output}`, 'var/*.info', 'var/*.xml'], callback)
);

/**
 * Generates the code coverage.
 */
gulp.task('cover', ['cover:instrument'], () => {
  process.env.npm_package_config_mocha_sonar_reporter_outputfile='var/TEST-results.xml';
  process.env.npm_package_config_mocha_sonar_reporter_testdir='test';

  return gulp.src(['test/*.js'], {read: false})
    .pipe(plugins.mocha({reporter: 'mocha-sonar-reporter'}))
    .pipe(plugins.istanbul.writeReports({dir: 'var', reporters: ['lcovonly']}));
});

gulp.task('cover:instrument', () => gulp.src(['lib/*.js'])
  .pipe(plugins.istanbul())
  .pipe(plugins.istanbul.hookRequire()));

/**
 * Builds the stylesheets.
 */
gulp.task('css', () => gulp.src(require.resolve('mocha/mocha.css'))
  .pipe(gulp.dest('www/css')));

/**
 * Creates a distribution file for this program.
 */
gulp.task('dist', ['default'], () => gulp.src(config.sources, {base: '.'})
  .pipe(plugins.zip(config.output))
  .pipe(gulp.dest('var')));

/**
 * Builds the documentation.
 */
gulp.task('doc', ['doc:assets']);

gulp.task('doc:assets', ['doc:rename'], () => gulp.src(['web/apple-touch-icon.png', 'web/favicon.ico'])
  .pipe(gulp.dest('doc/api')));

gulp.task('doc:build', callback => {
  _exec('jsdoc --configure doc/conf.json').then(callback, callback);
});

gulp.task('doc:rename', ['doc:build'], callback =>
  fs.rename(`doc/${pkg.name}/${pkg.version}`, 'doc/api', callback)
);

/**
 * Builds the client scripts.
 */
gulp.task('js', ['js:tests'], () => browserify({debug: true, entries: ['./www/js/main.js']})
  .bundle()
  .pipe(plugins.sourceStream('tests.js'))
  .pipe(plugins.buffer())
  .pipe(plugins.sourcemaps.init({loadMaps: true}))
  .pipe(plugins.uglify())
  .pipe(plugins.sourcemaps.write('.'))
  .pipe(gulp.dest('www/js')));

gulp.task('js:tests', () => gulp.src(require.resolve('mocha/mocha.js'))
  .pipe(plugins.uglify())
  .pipe(gulp.dest('www/js')));

/**
 * Performs static analysis of source code.
 */
gulp.task('lint', () => gulp.src(['*.js', 'bin/*.js', 'lib/*.js', 'test/*.js', 'www/js/main.js'])
  .pipe(plugins.jshint(pkg.jshintConfig))
  .pipe(plugins.jshint.reporter('default', {verbose: true})));

/**
 * Starts the Web server.
 */
gulp.task('serve', callback => {
  if('_server' in config) {
    config._server.kill();
    delete config._server;
  }

  config._server=child.fork('bin/cli.js');
  callback();
});

/**
 * Runs the unit tests.
 */
gulp.task('test', ['test:env'], () => gulp.src(['test/*.js'], {read: false})
  .pipe(plugins.mocha()));

gulp.task('test:env', callback => {
  if('AKISMET_API_KEY' in process.env) callback();
  else callback(new Error('AKISMET_API_KEY environment variable not set.'));
});

/**
 * Watches for file changes.
 */
gulp.task('watch', ['js', 'serve'], () => {
  gulp.watch('lib/*.js', ['js', 'serve']);
  gulp.watch(['test/*.js', 'www/js/main.js'], ['js']);
});

/**
 * Runs a command and prints its output.
 * @param {string} command The command to run, with space-separated arguments.
 * @return {Promise} Completes when the command is finally terminated.
 * @private
 */
function _exec(command) {
  return new Promise((resolve, reject) => child.exec(command, (err, stdout) => {
    let output=stdout.trim();
    if(output.length) console.log(output);
    if(err) reject(err);
    else resolve();
  }));
}
