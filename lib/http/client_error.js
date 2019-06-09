/** An exception caused by an error in a {@link NodeClient} or {@link BrowserClient} request. */
export class ClientError extends Error {

  /**
   * Creates a new client error.
   * @param {string} [message] A message describing the error.
   * @param {?URL} [uri] The URL of the HTTP request or response that failed.
   */
  constructor(message, uri = null) {
    super(message);

    /**
     * A name for the type of error.
     * @type {string}
     */
    this.name = 'ClientError';

    /**
     * The URL of the HTTP request or response that failed.
     * @type {?URL}
     */
    this.uri = uri;
  }
}
