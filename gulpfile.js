import gulp from "gulp";
import {spawn} from "node:child_process";
import {readdir, readFile, rm, writeFile} from "node:fs/promises";
import {join} from "node:path";
import pkg from "./package.json" with {type: "json"};

/** Builds the project. */
export async function build() {
	await run("npx tsc --build src/tsconfig.json");
}

/** Deletes all generated files. */
export async function clean() {
	await rm("lib", {force: true, recursive: true});
	for (const file of await readdir("var")) if (file != ".gitkeep") await rm(join("var", file), {recursive: true});
}

/** Builds the documentation. */
export async function doc() {
	await run("npx typedoc --options etc/TypeDoc.js");
}

/** Performs the static analysis of source code. */
export async function lint() {
	await run("npx tsc --build tsconfig.json --noEmit");
	await run("npx eslint --config=etc/ESLint.js gulpfile.js example src test");
}

/** Publishes the package. */
export async function publish() {
	await run("npx gulp");
	for (const action of ["tag", "push origin"]) await run(`git ${action} v${pkg.version}`);
	for (const registry of ["https://registry.npmjs.org", "https://npm.pkg.github.com"]) await run(`npm publish --registry=${registry}`);
}

/** Runs the test suite. */
export async function test() {
	await run("npx tsc --build src/tsconfig.json --sourceMap");
	await run("node --enable-source-maps --test");
}

/** Updates the version number in the sources. */
export async function version() {
	await replaceInFile("src/Client.ts", /#version = "\d+(\.\d+){2}"/, `#version = "${pkg.version}"`);
}

/** The default task. */
export default gulp.series(clean, version, build);

/**
 * Replaces the specified pattern in a given file.
 * @param {string} file The path of the file to be processed.
 * @param {RegExp} pattern The regular expression to find.
 * @param {string} replacement The replacement text.
 * @returns {Promise<void>} Resolves when the replacement has been completed.
 */
async function replaceInFile(file, pattern, replacement) {
	await writeFile(file, (await readFile(file, "utf8")).replace(pattern, replacement));
}

/**
 * Spawns a new process using the specified command.
 * @param {string} command The command to run.
 * @returns {Promise<void>} Resolves when the command is terminated.
 */
function run(command) {
	return new Promise((resolve, reject) => {
		const process = spawn(command, {shell: true, stdio: "inherit"});
		process.on("close", code => code ? reject(Error(command)) : resolve());
	});
}
