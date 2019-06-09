import {BaseClient} from '../http/client.js';
import {packageVersion} from '../version.g.js';

/** Submits comments to the [Akismet](https://akismet.com) service. */
export class Client extends BaseClient {

  /**
   * Creates a new client.
   * @param {string} apiKey The Akismet API key.
   * @param {Blog} blog The front page or home URL of the instance making requests.
   * @param {ClientOptions} [options] An object specifying values used to initialize this instance.
   */
  constructor(apiKey, blog, options = {}) {
    const http = {
      fetch: request => fetch(request),
      newRequest: (url, init) => new Request(url.href, init)
    };

    const version = new Date().toISOString().split('T')[0].replace(/-/g, '.');
    super(http, apiKey, blog, {
      userAgent: `Browser/${version} | Akismet/${packageVersion}`,
      ...options
    });
  }
}
