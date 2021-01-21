import { AppContext } from '../../context';
import {
  GetTrelloBoardListsArgs,
  IntegrationOperations,
  ProviderInfo,
} from '../../../shared/types/integrations/integrations';
import { forwardIntegrationEventsToWindows } from './services/forwardIntegrationEvents';
import { TrelloSettings } from '../../../shared/types/integrations/trello';
import { setupAuthTimeoutDialog } from './services/apiAuthStateDialogs';

export const setupIntegrations = (context: AppContext) => {
  setupAuthTimeoutDialog(context.apiAuthState);

  context.ipcService.registerAsMap({
    [IntegrationOperations.AuthorizeApi]: (_, { provider }: ProviderInfo) => {
      return context.apiAuthService.startAuth(provider);
    },
    [IntegrationOperations.GetAuthState]: (_, { provider }: ProviderInfo) => {
      return context.apiAuthState.getStateForProvider(provider);
    },
    [IntegrationOperations.GetTrelloBoards]: () => {
      return context.trelloService.getUserBoards();
    },
    [IntegrationOperations.GetTrelloBoardLists]: (
      _,
      { boardId }: GetTrelloBoardListsArgs
    ) => {
      return context.trelloService.getBoardLists(boardId);
    },
    [IntegrationOperations.SaveTrelloBoards]: (
      _,
      { boards }: Pick<TrelloSettings, 'boards'>
    ) => {
      return context.trelloService.saveBoards(boards ?? []);
    },
    [IntegrationOperations.UnauthorizeApi]: (_, { provider }: ProviderInfo) => {
      return context.apiAuthService.unAuthorize(provider);
    },
  });

  forwardIntegrationEventsToWindows(context.apiAuthService);
};
