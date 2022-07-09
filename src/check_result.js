/**
 * Specifies the result of a comment check.
 * @enum {number}
 */
export const CheckResult = Object.freeze({

	/** The comment is not a spam (i.e. a ham). */
	ham: 0,

	/** The comment is a spam. */
	spam: 1,

	/** The comment is a pervasive spam (i.e. it can be safely discarded). */
	pervasiveSpam: 2
});
