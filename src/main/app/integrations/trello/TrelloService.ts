import ElectronStore from 'electron-store';
import { AppStore } from '../../../../shared/types/store';
import { TrelloClient } from './TrelloClient';
import { ApiProvider } from '../../../../shared/types/integrations/integrations';
import { ApiService } from '../types';
import { Nullable } from '../../../../shared/types';
import { TrelloBoard } from '../../../../shared/types/integrations/trello';

export class TrelloService implements ApiService {
  readonly provider = ApiProvider.Trello;

  private static urlSchema = 'pixelpomodo://auth/trello?token=';

  constructor(
    private readonly store: ElectronStore<AppStore>,
    private readonly trelloClient: TrelloClient
  ) {}

  async setUserToken(token: string) {
    const member = await this.trelloClient.getTokenOwner(token);

    this.store.set('trello.userToken', token);
    this.store.set('trello.member', member);
  }

  async isAuthorized(): Promise<boolean> {
    const trello = this.store.get('trello');

    return Boolean(trello?.userToken && trello?.member);
  }

  async getUserToken() {
    return this.store.get('trello.userToken', null) as Nullable<string>;
  }

  async getAuthorizationUrl() {
    return this.trelloClient.getAuthorizationUrl();
  }

  async getUserBoards(): Promise<TrelloBoard[]> {
    if (!(await this.isAuthorized())) {
      return [];
    }

    const trello = this.store.get('trello');

    return this.trelloClient.getBoardsForMember(
      trello!.member!.id,
      trello!.userToken!
    );
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
