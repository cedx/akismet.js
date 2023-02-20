/** Packages the project. **/
function main() for (script in ["Clean", "Build", "Version"]) Sys.command('lix $script');
