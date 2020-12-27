import ElectronStore from 'electron-store';
import { AppStore } from '../../../shared/types/store';
import { dialog } from 'electron';

export class TrelloService {
  private static urlSchema = 'pixelpomodo://auth/trello?token=';

  constructor(private readonly store: ElectronStore<AppStore>) {}

  setUserToken(token: string) {
    this.store.set('trello.userToken', token);
  }

  getUserToken(): string | undefined {
    return this.store.get('trello.userToken');
  }

  /**
   * Checks and parses response from Trello oauth
   *
   * Example url: pixelpomodo://auth/trello?token=1234567
   * */
  handleAuthProtocol(url: string) {
    if (!url.startsWith(TrelloService.urlSchema)) {
      return;
    }

    const token = url.replace(TrelloService.urlSchema, '');

    dialog.showMessageBoxSync({
      message: `Got token ${token} ;)`
    })

    this.setUserToken(token);
  }
}
