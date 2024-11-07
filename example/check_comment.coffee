import {Author, Blog, CheckResult, Client, Comment, CommentType} from "@cedx/akismet"
import console from "node:console"

# Checks a comment against the Akismet service.
try
	author = new Author
		email: "john.doe@domain.com"
		ipAddress: "192.168.123.456"
		name: "John Doe"
		role: "guest"
		userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"

	comment = new Comment
		author: author
		date: new Date
		content: "A user comment."
		referrer: "https://github.com/cedx/akismet.js"
		type: CommentType.contactForm

	blog = new Blog
		charset: "UTF-8"
		languages: ["fr"]
		url: "https://www.yourblog.com"

	result = await new Client("123YourAPIKey", blog).checkComment comment
	console.log(if result is CheckResult.ham then "The comment is ham." else "The comment is spam.")

catch error
	console.error if error instanceof Error then error.message else error
