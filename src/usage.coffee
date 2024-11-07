# Provides API usage for a given month.
export class Usage

	# Creates a new usage.
	constructor: (options = {}) ->

		# The number of monthly API calls your plan entitles you to.
		@limit = options.limit ? (-1)

		# The percentage of the limit used since the beginning of the month.
		@percentage = options.percentage ? 0

		# Value indicating whether the requests are being throttled for having consistently gone over the limit.
		@throttled = options.throttled ? no

		# The number of calls (spam + ham) since the beginning of the month.
		@usage = options.usage ? 0

	# Creates a new usage from the specified JSON object.
	@fromJson: (json) -> new @
		limit: if Number.isInteger(json.limit) then json.limit else -1
		percentage: if typeof json.percentage is "number" then json.percentage else 0
		throttled: if typeof json.throttled is "boolean" then json.throttled else no
		usage: if Number.isInteger(json.usage) then json.usage else 0
