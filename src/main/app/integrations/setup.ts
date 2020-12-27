import { AppContext } from '../../context';
import { IntegrationEvents } from '../../../shared/types/integrations';
import { makeAuthorizeTrello } from '../../shared/trello/authorizeTrello';

export const setupIntegrations = (context: AppContext) => {
  context.ipcService.registerAsMap({
    [IntegrationEvents.GetTrelloAuthUrl]: () =>
      context.trelloClient.getAuthorizationUrl(),
    [IntegrationEvents.AuthorizeTrello]: () =>
      makeAuthorizeTrello(context.trelloClient, context.store)(),
  });
};
