import haxe.Json;
import sys.io.File;

/** Updates the version number in the sources. **/
function main() {
	final version = Json.parse(File.getContent("package.json")).version;
	Tools.replaceInFile("src/client.js", ~/#version = "\d+(\.\d+){2}"/, '#version = "$version"');
}
