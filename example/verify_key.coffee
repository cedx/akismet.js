import {Blog, Client} from "@cedx/akismet"
import console from "node:console"

# Verifies an Akismet API key.
try
	blog = new Blog url: "https://www.yourblog.com"
	client = new Client "123YourAPIKey", blog

	isValid = await client.verifyKey()
	console.log if isValid then "The API key is valid." else "The API key is invalid."

catch error
	console.error if error instanceof Error then error.message else error
