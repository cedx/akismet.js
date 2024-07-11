/**
 * Specifies the result of a comment check.
 */
export enum CheckResult {

	/**
	 * The comment is not a spam (i.e. a ham).
	 */
	ham,

	/**
	 * The comment is a spam.
	 */
	spam,

	/**
	 * The comment is a pervasive spam (i.e. it can be safely discarded).
	 */
	pervasiveSpam
}
