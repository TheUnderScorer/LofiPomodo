import { AppContext } from '../../context';
import {
  GetTrelloBoardListsArgs,
  IntegrationEvents,
  ProviderInfo,
} from '../../../shared/types/integrations/integrations';
import { forwardIntegrationEventsToWindows } from './services/forwardIntegrationEvents';
import { TrelloSettings } from '../../../shared/types/integrations/trello';
import { setupAuthTimeoutDialog } from './services/apiAuthStateDialogs';

export const setupIntegrations = (context: AppContext) => {
  setupAuthTimeoutDialog(context.apiAuthState);

  context.ipcService.registerAsMap({
    [IntegrationEvents.AuthorizeApi]: (_, { provider }: ProviderInfo) =>
      context.apiAuthService.startAuth(provider),
    [IntegrationEvents.GetAuthState]: (_, { provider }: ProviderInfo) =>
      context.apiAuthState.getStateForProvider(provider),
    [IntegrationEvents.GetTrelloBoards]: () =>
      context.trelloService.getUserBoards(),
    [IntegrationEvents.GetTrelloBoardLists]: (
      _,
      { boardId }: GetTrelloBoardListsArgs
    ) => context.trelloService.getBoardLists(boardId),
    [IntegrationEvents.SaveTrelloBoards]: (
      _,
      { boards }: Pick<TrelloSettings, 'boards'>
    ) => context.trelloService.saveBoards(boards ?? []),
  });

  forwardIntegrationEventsToWindows(context.apiAuthService);
};
