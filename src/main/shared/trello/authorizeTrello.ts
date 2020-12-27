import { TrelloClient } from './TrelloClient';
import ElectronStore from 'electron-store';
import { AppStore } from '../../../shared/types/store';
import { shell } from 'electron';

export const makeAuthorizeTrello = (
  client: TrelloClient,
  store: ElectronStore<AppStore>
) => async () => {
  const url = await client.getAuthorizationUrl();

  await shell.openExternal(url);
};
