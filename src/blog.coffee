# Represents the front page or home URL transmitted when making requests.
export class Blog

	# Creates a new blog.
	constructor: (options = {}) ->

		# The character encoding for the values included in comments.
		@charset = options.charset ? ""

		# The languages in use on the blog or site, in ISO 639-1 format.
		@languages = new Set(options.languages ? [])

		# The blog or site URL.
		@url = if options.url then new URL options.url else null

	# Creates a new blog from the specified JSON object.
	@fromJson: (json) -> new @
		charset: if typeof json.blog_charset is "string" then json.blog_charset else ""
		languages: if typeof json.blog_lang is "string" then json.blog_lang.split(",").map (language) -> language.trim() else []
		url: if typeof json.blog is "string" then json.blog else ""

	# Returns a JSON representation of this object.
	toJSON: ->
		map = blog: if @url? then @url.href else ""
		map.blog_charset = @charset if @charset
		map.blog_lang = Array.from(@languages).join "," if @languages.size
		map
