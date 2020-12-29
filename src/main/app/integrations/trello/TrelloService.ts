import ElectronStore from 'electron-store';
import { AppStore } from '../../../../shared/types/store';
import { TrelloClient } from './TrelloClient';
import { ApiProvider } from '../../../../shared/types/integrations';
import { ApiService } from '../types';
import { Nullable } from '../../../../shared/types';

export class TrelloService implements ApiService {
  readonly provider = ApiProvider.Trello;

  private static urlSchema = 'pixelpomodo://auth/trello?token=';

  constructor(
    private readonly store: ElectronStore<AppStore>,
    private readonly trelloClient: TrelloClient
  ) {}

  async setUserToken(token: string) {
    this.store.set('trello.userToken', token);
  }

  async getUserToken() {
    return this.store.get('trello.userToken', null) as Nullable<string>;
  }

  async getAuthorizationUrl() {
    return this.trelloClient.getAuthorizationUrl();
  }

  /**
   * Checks and parses response from Trello oauth
   *
   * Example url: pixelpomodo://auth/trello?token=1234567
   * */
  async handleAuthProtocol(url: string) {
    if (!url.startsWith(TrelloService.urlSchema)) {
      return undefined;
    }

    const token = url.replace(TrelloService.urlSchema, '');

    await this.setUserToken(token);

    return {
      token,
    };
  }
}
