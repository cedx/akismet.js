/** Represents the event parameter used for request events. */
export class RequestEvent {

  /**
   * Creates a new request event.
   * @param {Request} request The related HTTP request.
   */
  constructor(request) {

    /**
     * The related HTTP request.
     * @type {Request}
     */
    this.request = request;
  }
}

/** Represents the event parameter used for response events. */
export class ResponseEvent extends RequestEvent {

  /**
   * Creates a new response event.
   * @param {Response} response The related HTTP response.
   * @param {Request} request The request that triggered this response.
   */
  constructor(response, request) {
    super(request);

    /**
     * The related HTTP response.
     * @type {Response}
     */
    this.response = response;
  }
}
