/** An exception caused by an error in a [[NodeClient]] or [[BrowserClient]] request. */
export class ClientError extends Error {

  /**
   * Creates a new client error.
   * @param message A message describing the error.
   * @param uri The URL of the HTTP request or response that failed.
   */
  constructor(message: string = '', readonly uri?: URL) {
    super(message);
    this.name = 'ClientError';
  }
}
