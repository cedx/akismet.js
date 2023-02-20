import haxe.Json;
import sys.io.File;

/** Builds the project. **/
function main() {
	final version = Json.parse(File.getContent("package.json")).version;
	Tools.replaceInFile("src/client.js", ~/#version = "\d+(\.\d+){2}"/, '#version = "$version"');
	Sys.command("npx tsc --project src/jsconfig.json");
}
