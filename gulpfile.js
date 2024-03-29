import {cp} from "node:fs/promises";
import {deleteAsync} from "del";
import {$} from "execa";
import gulp from "gulp";
import replace from "gulp-replace";
import pkg from "./package.json" with {type: "json"};

// Builds the project.
export async function build() {
	return $`tsc --project src`;
}

// Deletes all generated files.
export function clean() {
	return deleteAsync(["lib", "var/**/*"]);
}

// Builds the documentation.
export async function doc() {
	await build();
	await $`typedoc --options etc/typedoc.js`;
	for (const file of ["CHANGELOG.md", "LICENSE.md"]) await cp(file, `docs/${file.toLowerCase()}`);
	return cp("docs/favicon.ico", "docs/api/favicon.ico");
}

// Performs the static analysis of source code.
export async function lint() {
	await build();
	await $`tsc --project .`;
	return $`eslint --config=etc/eslint.config.js gulpfile.js etc example src test`;
}

// Publishes the package.
export async function publish() {
	for (const registry of ["https://registry.npmjs.org", "https://npm.pkg.github.com"]) await $`npm publish --registry=${registry}`;
	for (const action of [["tag"], ["push", "origin"]]) await $`git ${action} v${pkg.version}`;
}

// Runs the test suite.
export async function test() {
	await build();
	return $`node --test --test-reporter=spec`;
}

// Updates the version number in the sources.
export function version() {
	return gulp.src("src/client.ts")
		.pipe(replace(/#version = "\d+(\.\d+){2}"/, `#version = "${pkg.version}"`))
		.pipe(gulp.dest("src"));
}

// The default task.
export default gulp.series(
	clean,
	version,
	build
);
