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
	constructor(options?: UsageOptions);

	/**
	 * Creates a new usage from the specified JSON object.
	 * @param json A JSON object representing a usage.
	 * @returns The instance corresponding to the specified JSON object.
	 */
	static fromJson(json: Record<string, any>): Usage;
}

/**
 * Defines the options of a {@link Usage} instance.
 */
export type UsageOptions = Partial<{

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
}>;
