import console from "node:console";
import {Blog, Client} from "@cedx/akismet";

/**
 * Verifies an Akismet API key.
 */
try {
	const blog = new Blog("https://www.yourblog.com");
	const isValid = await new Client("123YourAPIKey", blog).verifyKey();
	console.log(isValid ? "The API key is valid." : "The API key is invalid.");
}
catch (error) {
	console.log(`An error occurred: ${error}`);
}
