/**
 * Provides API usage for a given month.
 */
export class Usage {

	/**
	 * The number of monthly API calls your plan entitles you to.
	 * @type {number}
	 */
	limit;

	/**
	 * The percentage of the limit used since the beginning of the month.
	 * @type {number}
	 */
	percentage;

	/**
	 * Value indicating whether the requests are being throttled for having consistently gone over the limit.
	 * @type {boolean}
	 */
	throttled;

	/**
	 * The number of calls (spam + ham) since the beginning of the month.
	 * @type {number}
	 */
	usage;

	/**
	 * Creates a new usage.
	 * @param {Partial<UsageOptions>} options An object providing values to initialize this instance.
	 */
	constructor(options = {}) {
		this.limit = options.limit ?? -1;
		this.percentage = options.percentage ?? 0;
		this.throttled = options.throttled ?? false;
		this.usage = options.usage ?? 0;
	}

	/**
	 * Creates a new usage from the specified JSON object.
	 * @param {Record<string, any>} json A JSON object representing a usage.
	 * @returns {Usage} The instance corresponding to the specified JSON object.
	 */
	static fromJson(json) {
		return new this({
			limit: typeof json.limit == "number" && Number.isInteger(json.limit) ? json.limit : -1,
			percentage: typeof json.percentage == "number" ? json.percentage : 0,
			throttled: typeof json.throttled == "boolean" ? json.throttled : false,
			usage: typeof json.usage == "number" && Number.isInteger(json.usage) ? json.usage : 0
		});
	}
}

/**
 * Defines the options of a {@link Usage} instance.
 * @typedef {object} UsageOptions
 * @property {number} limit The number of monthly API calls your plan entitles you to.
 * @property {number} percentage The percentage of the limit used since the beginning of the month.
 * @property {boolean} throttled Value indicating whether the requests are being throttled for having consistently gone over the limit.
 * @property {number} usage The number of calls (spam + ham) since the beginning of the month.
 */
