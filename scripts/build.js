import {parseJson, replaceInFile} from "./tools.js";

/**
 * Updates the version number in the sources.
 */
const {version} = await parseJson("../package.json");
replaceInFile("src/client.js", /#version = "\d+(\.\d+){2}"/, `#version = "${version}"`);
