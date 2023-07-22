import {execSync} from "node:child_process";
import {cpSync} from "node:fs";

/**
 * Builds the documentation.
 */
["CHANGELOG.md", "LICENSE.md"].forEach(file => cpSync(file, `docs/${file.toLowerCase()}`));
execSync("npx typedoc --options etc/typedoc.json");
cpSync("docs/favicon.ico", "docs/api/favicon.ico");
