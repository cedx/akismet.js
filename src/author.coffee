# Represents the author of a comment.
export class Author

	# Creates a new author.
	constructor: (options = {}) ->

		# The author's mail address. If you set it to `"akismet-guaranteed-spam@example.com"`, Akismet will always return `true`.
		@email = options.email ? ""

		# The author's IP address.
		@ipAddress = options.ipAddress ? ""

		# The author's name. If you set it to `"viagra-test-123"`, Akismet will always return `true`.
		@name = options.name ? ""

		# The author's role. If you set it to `"administrator"`, Akismet will always return `false`.
		@role = options.role ? ""

		# The URL of the author's website.
		@url = if options.url then new URL options.url else null

		# The author's user agent, that is the string identifying the Web browser used to submit comments.
		@userAgent = options.userAgent ? ""

	# Creates a new author from the specified JSON object.
	@fromJson: (json) -> new @
		email: if typeof json.comment_author_email == "string" then json.comment_author_email else ""
		ipAddress: if typeof json.user_ip == "string" then json.user_ip else ""
		name: if typeof json.comment_author == "string" then json.comment_author else ""
		role: if typeof json.user_role == "string" then json.user_role else ""
		url: if typeof json.comment_author_url == "string" then json.comment_author_url else ""
		userAgent: if typeof json.user_agent == "string" then json.user_agent else ""

	# Returns a JSON representation of this object.
	toJSON: ->
		map = user_ip: @ipAddress
		map.comment_author_email = @email if @email
		map.comment_author = @name if @name
		map.user_role = @role if @role
		map.comment_author_url = @url.href if @url
		map.user_agent = @userAgent if @userAgent
		map

# Specifies the role of an author.
export AuthorRole = Object.freeze

	# The author is an administrator.
	administrator: "administrator"
