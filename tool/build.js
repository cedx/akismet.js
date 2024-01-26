import {readFileSync, writeFileSync} from "node:fs";
import pkg from "../package.json" with {type: "json"};

// Updates the version number in the sources.
const file = "src/client.ts";
writeFileSync(file, readFileSync(file, {encoding: "utf8"}).replace(/#version = "\d+(\.\d+){2}"/, `#version = "${pkg.version}"`));
