import {Blog, Client} from "@cedx/akismet";
import console from "node:console";

// Verifies an Akismet API key.
try {
	const blog = new Blog({url: "https://www.yourblog.com"});
	const client = new Client("123YourAPIKey", blog);

	const isValid = await client.verifyKey();
	console.log(isValid ? "The API key is valid." : "The API key is invalid.");
}
catch (error) {
	console.error(error instanceof Error ? error.message : error);
}
