import { AppContext } from '../../context';
import {
  IntegrationEvents,
  ProviderInfo,
} from '../../../shared/types/integrations/integrations';
import { forwardIntegrationEventsToWindows } from './services/forwardIntegrationEvents';

export const setupIntegrations = (context: AppContext) => {
  context.ipcService.registerAsMap({
    [IntegrationEvents.AuthorizeApi]: (_, { provider }: ProviderInfo) =>
      context.apiAuthService.startAuth(provider),
    [IntegrationEvents.GetAuthState]: (_, { provider }: ProviderInfo) =>
      context.apiAuthState.getStateForProvider(provider),
    [IntegrationEvents.GetTrelloBoards]: () =>
      context.trelloService.getUserBoards(),
  });

  forwardIntegrationEventsToWindows(context);
};
