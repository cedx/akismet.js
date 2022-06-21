import {readFile} from "node:fs/promises";

/**
 * The package configuration.
 * @type {Record<string, any>}
 */
const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

/**
 * The version number of this package.
 * @type {string}
 */
export default pkg.version;
