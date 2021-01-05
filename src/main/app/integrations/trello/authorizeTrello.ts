import { shell } from 'electron';
import { TrelloService } from './TrelloService';

export const authorizeTrello = async (service: TrelloService) => {
  const url = await service.getAuthorizationUrl();

  await shell.openExternal(url);
};
