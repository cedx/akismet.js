/** Represents the event parameter used for request events. */
export class RequestEvent {

  /**
   * Creates a new request event.
   * @param request The related HTTP request.
   */
  constructor(readonly request: Request) {}
}

/** Represents the event parameter used for response events. */
export class ResponseEvent extends RequestEvent {

  /**
   * Creates a new response event.
   * @param response The related HTTP response.
   * @param request The request that triggered this response.
   */
  constructor(readonly response: Response, request: Request) {
    super(request);
  }
}
