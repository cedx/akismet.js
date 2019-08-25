import {packageVersion} from '../version.g';
import {RequestEvent, ResponseEvent} from './events';
import {ClientMixin} from './mixin';

/**
 * Defines the options of a {@link BrowserClient} instance.
 * @typedef {object} ClientOptions
 * @property {URL} [endPoint] The URL of the API end point.
 * @property {boolean} [isTest] Value indicating whether the client operates in test mode.
 * @property {string} [userAgent] The user agent string to use when making requests.
 */

/**
 * Submits comments to the {@link https://akismet.com|Akismet} service.
 * @mixes ClientConstructor
 * @mixes ClientPrototype
 */
export class BrowserClient extends EventTarget {

  /**
   * Creates a new client.
   * @param {string} apiKey The Akismet API key.
   * @param {Blog} blog The front page or home URL of the instance making requests.
   * @param {ClientOptions} [options] An object specifying values used to initialize this instance.
   */
  constructor(apiKey, blog, options = {}) {
    super();

    const {
      endPoint = new URL('https://rest.akismet.com/1.1/'),
      isTest = false,
      userAgent = `Browser/${new Date().toISOString().split('T')[0].replace(/-/g, '.')} | Akismet/${packageVersion}`
    } = options;

    /**
     * The Akismet API key.
     * @type {string}
     */
    this.apiKey = apiKey;

    /**
     * The front page or home URL of the instance making requests.
     * @type {Blog}
     */
    this.blog = blog;

    /**
     * The URL of the API end point.
     * @type {URL}
     */
    this.endPoint = endPoint;

    /**
     * Value indicating whether the client operates in test mode.
     * @type {boolean}
     */
    this.isTest = isTest;

    /**
     * The user agent string to use when making requests.
     * @type {string}
     */
    this.userAgent = userAgent;
  }

  /**
   * Queries the service by posting the specified fields to a given end point, and returns the response as a string.
   * @param {URL} endPoint The URL of the end point to query.
   * @param {object} fields The fields describing the query body.
   * @return {Promise<string>} The response as string.
   */
  private async _fetch(endPoint, fields) {
    const body = new URLSearchParams({...this.blog.toJSON(), ...fields});
    if (this.isTest) body.set('is_test', '1');

    const request = new Request(endPoint.href, {
      body,
      headers: {'content-type': 'application/x-www-form-urlencoded', 'user-agent': this.userAgent},
      method: 'POST'
    });

    let detail = new RequestEvent(request);
    this.dispatchEvent(new CustomEvent(BrowserClient.eventRequest, {detail}));

    let response;
    try { response = await fetch(request); }
    catch (err) { throw new ClientError(err.message, endPoint); }

    detail = new ResponseEvent(response, request);
    this.dispatchEvent(new CustomEvent(BrowserClient.eventResponse, {detail}));

    if (!response.ok) throw new ClientError('An error occurred while querying the end point', endPoint);
    if (response.headers.has('x-akismet-debug-help')) throw new ClientError(response.headers.get('x-akismet-debug-help'), endPoint);
    return response.text();
  }
}

// Apply the client mixins.
Object.assign(BrowserClient, ClientConstructor);
Object.assign(BrowserClient.prototype, ClientPrototype);
