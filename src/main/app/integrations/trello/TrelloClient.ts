import fetchFn, { Response } from 'node-fetch';
import { productName } from '../../../../../package.json';
import { InvalidTrelloResponse } from './errors/InvalidTrelloResponse';
import {
  TrelloBoard,
  TrelloList,
  TrelloMember,
} from '../../../../shared/types/integrations/trello';

export interface SearchParams {
  idBoards?: string[];
}

export type SearchResponse = Array<TrelloBoard | TrelloMember>;

export class TrelloClient {
  private static readonly baseUrl = 'https://api.trello.com';

  constructor(
    private readonly apiKey: string,
    private readonly redirectUrl: string,
    private readonly fetch: typeof fetchFn
  ) {
    if (!this.apiKey) {
      throw new TypeError('Trello api key is missing.');
    }
  }

  async getAuthorizationUrl() {
    const url = this.getUrl();

    url.pathname = '/1/authorize';
    url.searchParams.append('name', productName);
    url.searchParams.append('scope', 'read,write');
    url.searchParams.append('response_type', 'token');
    url.searchParams.append('expiration', 'never');
    url.searchParams.append('callback_method', 'fragment');
    url.searchParams.append('return_url', this.redirectUrl);

    return url.toString();
  }

  private getUrl(token?: string) {
    const url = new URL(TrelloClient.baseUrl);

    url.searchParams.append('key', this.apiKey);

    if (token) {
      url.searchParams.append('token', token);
    }

    return url;
  }

  async getTokenOwner(token: string): Promise<TrelloMember> {
    const url = this.getUrl();

    url.pathname = `/1/tokens/${token}/member`;

    const response = await this.fetch(url);

    TrelloClient.checkResponse(response);

    return response.json();
  }

  private static checkResponse(
    res: Response,
    allowedStatuses: number[] = [200]
  ) {
    if (!allowedStatuses.includes(res.status)) {
      throw new InvalidTrelloResponse(res.status);
    }
  }

  async search(token: string, params: SearchParams): Promise<SearchResponse> {
    const url = this.getUrl(token);

    url.pathname = '/1/search';

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const result = await this.fetch(url);

    TrelloClient.checkResponse(result);

    return result.json();
  }

  async getBoardsForMember(
    memberId: string,
    token: string
  ): Promise<TrelloBoard[]> {
    const url = this.getUrl(token);

    url.pathname = `/1/members/${memberId}/boards`;

    const result = await this.fetch(url);

    TrelloClient.checkResponse(result);

    return result.json();
  }

  async getListsForBoard(
    boardId: string,
    token: string
  ): Promise<TrelloList[]> {
    const url = this.getUrl(token);

    url.pathname = `/1/boards/${boardId}/lists`;

    const result = await this.fetch(url);

    TrelloClient.checkResponse(result);

    return result.json();
  }
}
