/**
 * Provides static properties for {@link https://akismet.com|Akismet} clients.
 * @mixin
 */
export const ClientConstructor = {

  /**
   * An event that is triggered when a request is made to the remote service.
   * @type {string}
   */
  get eventRequest() {
    return 'request';
  },

  /**
   * An event that is triggered when a response is received from the remote service.
   * @type {string}
   */
  get eventResponse() {
    return 'response';
  }
};

/**
 * Provides the instance methods for {@link https://akismet.com|Akismet} clients.
 * @mixin
 */
export const ClientPrototype = {

  /**
   * Checks the specified comment against the service database, and returns a value indicating whether it is spam.
   * @param {Comment} comment The comment to be checked.
   * @return {Promise<boolean>} A boolean value indicating whether it is spam.
   */
  async checkComment(comment) {
    const endPoint = new URL(`${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}${this.endPoint.pathname}`);
    return await this._fetch(new URL('comment-check', endPoint), comment.toJSON()) == 'true';
  },

  /**
   * Submits the specified comment that was incorrectly marked as spam but should not have been.
   * @param {Comment} comment The comment to be submitted.
   * @return {Promise} Completes once the comment has been submitted.
   */
  async submitHam(comment) {
    const endPoint = new URL(`${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}${this.endPoint.pathname}`);
    return this._fetch(new URL('submit-ham', endPoint), comment.toJSON());
  },

  /**
   * Submits the specified comment that was not marked as spam but should have been.
   * @param {Comment} comment The comment to be submitted.
   * @return {Promise} Completes once the comment has been submitted.
   */
  async submitSpam(comment) {
    const endPoint = new URL(`${this.endPoint.protocol}//${this.apiKey}.${this.endPoint.host}${this.endPoint.pathname}`);
    return this._fetch(new URL('submit-spam', endPoint), comment.toJSON());
  },

  /**
   * Checks the API key against the service database, and returns a value indicating whether it is valid.
   * @return {Promise<boolean>} A boolean value indicating whether it is a valid API key.
   */
  async verifyKey() {
    return await this._fetch(new URL('verify-key', this.endPoint), {key: this.apiKey}) == 'valid';
  }
};
