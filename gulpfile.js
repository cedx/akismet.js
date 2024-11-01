import gulp from "gulp";
import {spawn} from "node:child_process";
import {readdir, readFile, rm, writeFile} from "node:fs/promises";
import {join} from "node:path";
import pkg from "./package.json" with {type: "json"};

/** Builds the project. */
export async function build() {
	const file = "src/client.ts";
	await writeFile(file, (await readFile(file, "utf8")).replace(/#version = "\d+(\.\d+){2}"/, `#version = "${pkg.version}"`));
	return exec("tsc", "--build", "src/tsconfig.json");
}

/** Deletes all generated files. */
export async function clean() {
	await rm("lib", {force: true, recursive: true});
	for (const file of await readdir("var")) if (file != ".gitkeep") await rm(join("var", file), {recursive: true});
}

/** Performs the static analysis of source code. */
export async function lint() {
	await build();
	await exec("tsc", "--build", "tsconfig.json");
	return exec("eslint", "--config=etc/eslint.js", "gulpfile.js", "example", "src", "test");
}

/** Publishes the package. */
export async function publish() {
	for (const registry of ["https://registry.npmjs.org", "https://npm.pkg.github.com"]) await run("npm", "publish", `--registry=${registry}`);
	for (const action of [["tag"], ["push", "origin"]]) await run("git", ...action, `v${pkg.version}`);
}

/** Runs the test suite. */
export async function test() {
	await build();
	return run("node", "--test", "--test-reporter=spec");
}

/** Watches for file changes. */
export function watch() {
	return exec("tsc", "--build", "src/tsconfig.json", "--preserveWatchOutput", "--watch");
}

/** The default task. */
export default gulp.series(
	clean,
	build
);

/**
 * Executes a command from a local package.
 * @param {string} command The command to run.
 * @param {...string} args The command arguments.
 * @return {Promise<void>} Resolves when the command is terminated.
 */
function exec(command, ...args) {
	return run("npm", "exec", "--", command, ...args);
}

/**
 * Spawns a new process using the specified command.
 * @param {string} command The command to run.
 * @param {...string} args The command arguments.
 * @return {Promise<void>} Resolves when the command is terminated.
 */
function run(command, ...args) {
	const {promise, resolve: fulfill, reject} = /** @type {PromiseWithResolvers<void>} */ (Promise.withResolvers());
	spawn(command, args, {shell: true, stdio: "inherit"}).on("close", code => code ? reject(Error([command].concat(args).join(" "))) : fulfill());
	return promise;
}
