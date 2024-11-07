import {Author, Blog, Client, Comment} from "@cedx/akismet"
import console from "node:console"

# Submits ham to the Akismet service.
try
	blog = new Blog url: "https://www.yourblog.com"
	client = new Client "123YourAPIKey", blog

	comment = new Comment
		content: "I'm testing out the Service API."
		author: new Author
			ipAddress: "192.168.123.456"
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"

	await client.submitHam comment
	console.log "The comment was successfully submitted as ham."

catch error
	console.error if error instanceof Error then error.message else error
