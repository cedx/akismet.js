import gulp from "gulp";
import {spawn} from "node:child_process";
import {readdir, readFile, rm, writeFile} from "node:fs/promises";
import {delimiter, join, resolve} from "node:path";
import {env} from "node:process";
import pkg from "./package.json" with {type: "json"};

// Initialize the build system.
env.PATH = `${resolve("node_modules/.bin")}${delimiter}${env.PATH}`;

/** Builds the project. */
export async function build() {
	const file = "src/client.ts";
	await writeFile(file, (await readFile(file, "utf8")).replace(/#version = "\d+(\.\d+){2}"/, `#version = "${pkg.version}"`));
	return $("tsc", ["--build", "src/tsconfig.json"]);
}

/** Deletes all generated files. */
export async function clean() {
	await rm("lib", {force: true, recursive: true});
	for (const file of await readdir("var")) if (file != ".gitkeep") await rm(join("var", file), {recursive: true});
}

/** Performs the static analysis of source code. */
export async function lint() {
	await build();
	await $("tsc", ["--build", "tsconfig.json"]);
	return $("eslint", ["--config=etc/eslint.js", "gulpfile.js", "example", "src", "test"]);
}

/** Publishes the package. */
export async function publish() {
	for (const registry of ["https://registry.npmjs.org", "https://npm.pkg.github.com"]) await $("npm", ["publish", `--registry=${registry}`]);
	for (const action of [["tag"], ["push", "origin"]]) await $("git", [...action, `v${pkg.version}`]);
}

/** Runs the test suite. */
export async function test() {
	await build();
	return $("node", ["--test", "--test-reporter=spec"]);
}

/** The default task. */
export default gulp.series(
	clean,
	build
);

/**
 * Spawns a new process using the specified command.
 * @param {string} command The command to run.
 * @param {string[]} args The command arguments.
 * @param {import("node:child_process").SpawnOptionsWithoutStdio} options The settings to customize how the process is spawned.
 * @return {Promise<void>} Resolves when the command is terminated.
 */
function $(command, args = [], options = {}) {
	const {promise, resolve: fulfill, reject} = /** @type {PromiseWithResolvers<void>} */ (Promise.withResolvers());
	spawn(command, args, {shell: true, stdio: "inherit", ...options}).on("close", code => code ? reject(new Error(command)) : fulfill());
	return promise;
}
