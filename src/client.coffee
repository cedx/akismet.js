import {CheckResult} from "./check_result.js"

# Submits comments to the [Akismet](https://akismet.com) service.
export class Client

	# The response returned by the "submit-ham" and "submit-spam" endpoints when the outcome is a success.
	@_success = "Thanks for making the web a better place."

	# The package version.
	@_version = "17.0.0"

	# Creates a new client.
	constructor: (apiKey, blog, options = {}) ->
		{baseUrl = "https://rest.akismet.com"} = options
		[nodeVersion] = process.version[1..].split "."
		url = if baseUrl instanceof URL then baseUrl.href else baseUrl

		# The Akismet API key.
		@apiKey = apiKey

		# The base URL of the remote API endpoint.
		@baseUrl = new URL if url.endsWith("/") then url else "#{url}/"

		# The front page or home URL of the instance making requests.
		@blog = blog

		# Value indicating whether the client operates in test mode.
		@isTest = options.isTest ? no

		# The user agent string to use when making requests.
		@userAgent = options.userAgent ? "Node.js/#{nodeVersion} | Akismet/#{Client._version}"

	# Checks the specified comment against the service database, and returns a value indicating whether it is spam.
	checkComment: (comment) ->
		response = await @_fetch "1.1/comment-check", comment.toJSON()
		switch
			when await response.text() is "false" then CheckResult.ham
			when response.headers.get("x-akismet-pro-tip") is "discard" then CheckResult.pervasiveSpam
			else CheckResult.spam

	# Submits the specified comment that was incorrectly marked as spam but should not have been.
	submitHam: (comment) ->
		response = await @_fetch "1.1/submit-ham", comment.toJSON()
		throw Error "Invalid server response." unless await response.text() is Client._success

	# Submits the specified comment that was not marked as spam but should have been.
	submitSpam: (comment) ->
		response = await @_fetch "1.1/submit-spam", comment.toJSON()
		throw Error "Invalid server response." unless await response.text() is Client._success

	# Checks the API key against the service database, and returns a value indicating whether it is valid.
	verifyKey: ->
		try
			response = await @_fetch "1.1/verify-key"
			await response.text() is "valid"
		catch
			no

	# Queries the service by posting the specified fields to a given end point, and returns the response.
	_fetch: (endpoint, fields = {}) ->
		body = new URLSearchParams {@blog.toJSON()..., api_key: @apiKey}
		body.set "is_test", "1" if @isTest

		for [key, value] from Object.entries fields
			unless Array.isArray value then body.set key, String(value)
			else
				index = 0
				body.set "#{key}[#{index++}]", String(item) for item from value

		response = await fetch new URL(endpoint, @baseUrl), {method: "POST", headers: {"user-agent": @userAgent}, body}
		throw Error "#{response.status} #{response.statusText}" unless response.ok

		{headers} = response
		throw Error "#{headers.get "x-akismet-alert-code"} #{headers.get "x-akismet-alert-msg"}" if headers.has "x-akismet-alert-code"
		throw Error headers.get "x-akismet-debug-help" if headers.has "x-akismet-debug-help"
		response
