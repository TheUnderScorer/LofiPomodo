import { AppContext } from '../../context';
import {
  GetTrelloBoardListsArgs,
  IntegrationEvents,
  ProviderInfo,
} from '../../../shared/types/integrations/integrations';
import { forwardIntegrationEventsToWindows } from './services/forwardIntegrationEvents';
import { TrelloSettings } from '../../../shared/types/integrations/trello';

export const setupIntegrations = (context: AppContext) => {
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

  forwardIntegrationEventsToWindows(context);
};
