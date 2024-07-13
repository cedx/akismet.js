import {readFile, writeFile} from "node:fs/promises";
import {env} from "node:process";
import {deleteAsync} from "del";
import {execa} from "execa";
import gulp from "gulp";
import pkg from "./package.json" with {type: "json"};

// Runs a command.
const $ = execa({preferLocal: true, stdio: "inherit"});

// Builds the project.
export async function build() {
	const file = "src/client.ts";
	await writeFile(file, (await readFile(file, "utf8")).replace(/#version = "\d+(\.\d+){2}"/, `#version = "${pkg.version}"`));
	return $`tsc --project src/tsconfig.json`;
}

// Deletes all generated files.
export function clean() {
	return deleteAsync(["lib", "var/**/*"]);
}

// Performs the static analysis of source code.
export async function lint() {
	await build();
	await $`tsc --project tsconfig.json`;
	return $`eslint --config=etc/eslint.js gulpfile.js example src test`;
}

// Publishes the package.
export async function publish() {
	for (const registry of ["https://registry.npmjs.org", "https://npm.pkg.github.com"]) await $`npm publish --registry=${registry}`;
	for (const action of [["tag"], ["push", "origin"]]) await $`git ${action} v${pkg.version}`;
}

// Runs the test suite.
export async function test() {
	env.NODE_ENV = "test";
	await build();
	return $`node --test --test-reporter=spec`;
}

// The default task.
export default gulp.series(
	clean,
	build
);
