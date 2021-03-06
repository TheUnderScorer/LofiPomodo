import ElectronStore from 'electron-store';
import { AppStore } from '../../../../shared/types/store';
import { TrelloClient } from './TrelloClient';
import { ApiProvider } from '../../../../shared/types/integrations/integrations';
import { ApiService } from '../types';
import { Nullable } from '../../../../shared/types';
import {
  TrelloBoard,
  TrelloBoardSettings,
  TrelloCard,
  UpdateCardInput,
} from '../../../../shared/types/integrations/trello';
import pLimit from 'p-limit';
import { MissingTrelloToken } from './errors/MissingTrelloToken';

export class TrelloService implements ApiService {
  readonly provider = ApiProvider.Trello;

  private static urlSchema = 'pixelpomodo://auth/trello?token=';

  private static batchPromisesLimit = 3;

  constructor(
    private readonly store: ElectronStore<AppStore>,
    private readonly trelloClient: TrelloClient
  ) {}
  get trelloSettings() {
    return this.store.get('trello');
  }

  get boardSettings() {
    return this.store.get('trello.boards') as TrelloBoardSettings[] | undefined;
  }

  async setUserToken(token: string) {
    const member = await this.trelloClient.getTokenOwner(token);

    this.store.set('trello.userToken', token);
    this.store.set('trello.member', member);
  }

  async isAuthorized(): Promise<boolean> {
    const trello = this.trelloSettings;

    return Boolean(trello?.userToken && trello?.member);
  }

  async unAuthorize(): Promise<void> {
    const settings = this.trelloSettings;

    if (!settings) {
      return;
    }

    settings.userToken = undefined;
    settings.member = undefined;
    settings.boards = [];

    this.store.set('trello', settings);
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

    const trello = this.trelloSettings;

    return this.trelloClient.getBoardsForMember(
      trello!.member!.id,
      trello!.userToken!
    );
  }

  async getBoardLists(boardId: string) {
    if (!(await this.isAuthorized())) {
      return [];
    }

    const token = await this.getUserToken();

    return this.trelloClient.getListsForBoard(boardId, token!);
  }

  async getCards(): Promise<TrelloCard[]> {
    const trelloSettings = this.trelloSettings;

    if (!(await this.isAuthorized()) || !trelloSettings?.boards?.length) {
      return [];
    }

    const limit = pLimit(TrelloService.batchPromisesLimit);

    const boards = trelloSettings.boards.filter((board) =>
      Boolean(board.listIds?.length)
    );

    const result = await Promise.all(
      boards.map((board) => limit(() => this.getCardsForLists(board.listIds!)))
    );

    return result.flat();
  }

  async getCardsForLists(listIds: string[]): Promise<TrelloCard[]> {
    if (!(await this.isAuthorized())) {
      return [];
    }

    const token = await this.getUserToken();

    const limit = pLimit(TrelloService.batchPromisesLimit);

    const result = await Promise.all(
      listIds.map((listId) =>
        limit(() => this.trelloClient.getCardsForList(listId, token!))
      )
    );

    return result.flat();
  }

  async saveBoards(boards: TrelloBoardSettings[]) {
    this.store.set('trello.boards', boards);
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

    console.log(`Resolved token ${token}`);

    await this.setUserToken(token);

    return {
      token,
    };
  }

  async updateCard(card: UpdateCardInput) {
    if (!(await this.isAuthorized())) {
      throw new MissingTrelloToken();
    }

    const token = await this.getUserToken();

    return this.trelloClient.updateCard(card, token!);
  }
}
