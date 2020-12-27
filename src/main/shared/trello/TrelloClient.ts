import fetchFn from 'node-fetch';
import { productName } from '../../../../package.json';
import { getAppProtocol } from '../protocol/getAppProtocol';

export class TrelloClient {
  private static readonly baseUrl = 'https://api.trello.com/1';

  constructor(
    private readonly apiKey: string,
    private readonly fetch: typeof fetchFn
  ) {
    if (!this.apiKey) {
      throw new TypeError('Trello api key is missing.');
    }
  }

  async getAuthorizationUrl() {
    const url = new URL(TrelloClient.baseUrl);
    url.pathname = '/1/authorize';
    url.searchParams.append('name', productName);
    url.searchParams.append('scope', 'read,write');
    url.searchParams.append('key', this.apiKey);
    url.searchParams.append('response_type', 'token');
    url.searchParams.append('expiration', 'never');
    url.searchParams.append('return_url', getAppProtocol('auth/trello'));

    return url.toString();
  }
}
