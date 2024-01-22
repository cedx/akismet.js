import {readFileSync, readdirSync, rmSync, writeFileSync} from "node:fs";
import {join} from "node:path";

/**
 * Recursively deletes all files in the specified directory.
 * @param {string} directory The directory to clean.
 */
export function cleanDirectory(directory) {
	readdirSync(directory).filter(item => item != ".gitkeep").forEach(item => rmSync(join(directory, item), {force: true, recursive: true}));
}

/**
 * Parses the content of the specified JSON file.
 * @param {string} path The relative path to the JSON file.
 * @returns {any} The parsed content.
 */
export function parseJson(path) {
	return JSON.parse(readFileSync(new URL(path, import.meta.url), {encoding: "utf8"}));
}

/**
 * Replaces in the specified file the substring which the pattern matches with the given replacement.
 * @param {string} file The path of the file to process.
 * @param {RegExp} pattern The pattern to search for.
 * @param {string} replacement The string to replace.
 */
export function replaceInFile(file, pattern, replacement) {
	writeFileSync(file, readFileSync(file, {encoding: "utf8"}).replace(pattern, replacement));
}
