# Represents a comment submitted by an author.
export class Comment

	# Creates a new comment.
	constructor: (options = {}) ->

		# The comment's author.
		@author = options.author ? null

		# The comment's content.
		@content = options.content ? ""

		# The context in which this comment was posted.
		@context = options.context ? []

		# The UTC timestamp of the creation of the comment.
		@date = options.date ? null

		# The permanent location of the entry the comment is submitted to.
		@permalink = if options.permalink then new URL options.permalink else null

		# The UTC timestamp of the publication time for the post, page or thread on which the comment was posted.
		@postModified = options.postModified ? null

		# A string describing why the content is being rechecked.
		@recheckReason = options.recheckReason ? ""

		# The URL of the webpage that linked to the entry being requested.
		@referrer = if options.referrer then new URL options.referrer else null

		# The comment's type.
		@type = options.type ? ""

	# Creates a new comment from the specified JSON object.
	@fromJson: (json) ->
		hasAuthor = Object.keys(json).filter((key) -> key.startsWith "comment_author" or key.startsWith "user").length > 0
		new @
			author: if hasAuthor then Author.fromJson json else null
			content: if typeof json.comment_content == "string" then json.comment_content else ""
			context: if Array.isArray json.comment_context then json.comment_context else []
			date: if typeof json.comment_date_gmt == "string" then new Date json.comment_date_gmt else null
			permalink: if typeof json.permalink == "string" then json.permalink else ""
			postModified: if typeof json.comment_post_modified_gmt == "string" then new Date json.comment_post_modified_gmt else null
			recheckReason: if typeof json.recheck_reason == "string" then json.recheck_reason else ""
			referrer: if typeof json.referrer == "string" then json.referrer else ""
			type: if typeof json.comment_type == "string" then json.comment_type else ""

	# Returns a JSON representation of this object.
	toJSON: ->
		map = @author?.toJSON() ? {}
		map.comment_content = @content if @content
		map.comment_context = @context if @context.length
		map.comment_date_gmt = @date.toJSON() if @date
		map.permalink = @permalink.href if @permalink
		map.comment_post_modified_gmt = @postModified.toJSON() if @postModified
		map.recheck_reason = @recheckReason if @recheckReason
		map.referrer = @referrer.href if @referrer
		map.comment_type = @type if @type
		map

# Specifies the type of a comment.
export CommentType = Object.freeze

	# A blog post.
	blogPost: "blog-post"

	# A blog comment.
	comment: "comment"

	# A contact form or feedback form submission.
	contactForm: "contact-form"

	# A top-level forum post.
	forumPost: "forum-post"

	# A message sent between just a few users.
	message: "message"

	# A reply to a top-level forum post.
	reply: "reply"

	# A new user account.
	signup: "signup"
