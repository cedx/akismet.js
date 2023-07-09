import sys.io.File;

/** Builds the documentation. **/
function main() {
	Sys.command("npx typedoc --options etc/typedoc.json");
	File.copy("docs/favicon.ico", "docs/api/favicon.ico");
}
