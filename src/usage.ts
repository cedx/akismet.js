/**
 * Provides API usage for a given month.
 */
export class Usage {

	/**
	 * The number of monthly API calls your plan entitles you to.
	 */
	limit: number;

	/**
	 * The percentage of the limit used since the beginning of the month.
	 */
	percentage: number;

	/**
	 * Value indicating whether the requests are being throttled for having consistently gone over the limit.
	 */
	throttled: boolean;

	/**
	 * The number of calls (spam + ham) since the beginning of the month.
	 */
	usage: number;

	/**
	 * Creates a new usage.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options: UsageOptions = {}) {
		this.limit = options.limit ?? -1;
		this.percentage = options.percentage ?? 0;
		this.throttled = options.throttled ?? false;
		this.usage = options.usage ?? 0;
	}

	/**
	 * Creates a new usage from the specified JSON object.
	 * @param json A JSON object representing a usage.
	 * @returns The instance corresponding to the specified JSON object.
	 */
	static fromJson(json: Record<string, any>): Usage {
		return new this({
			limit: Number.isInteger(json.limit) ? json.limit as number : -1,
			percentage: typeof json.percentage == "number" ? json.percentage : 0,
			throttled: typeof json.throttled == "boolean" ? json.throttled : false,
			usage: Number.isInteger(json.usage) ? json.usage as number : 0
		});
	}
}

/**
 * Defines the options of a {@link Usage} instance.
 */
export type UsageOptions = Partial<{

	/**
	 * The number of monthly API calls your plan entitles you to.
	 */
	limit: number,

	/**
	 * The percentage of the limit used since the beginning of the month.
	 */
	percentage: number,

	/**
	 * Value indicating whether the requests are being throttled for having consistently gone over the limit.
	 */
	throttled: boolean,

	/**
	 * The number of calls (spam + ham) since the beginning of the month.
	 */
	usage: number
}>;
