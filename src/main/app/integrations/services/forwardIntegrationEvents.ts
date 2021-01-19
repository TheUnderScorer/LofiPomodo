import { ApiAuthService } from './ApiAuthService';
import { sendObservablesToWindows } from '../../../shared/windows/sendObservablesToAllWindows';
import { IntegrationSubscriptionTopics } from '../../../../shared/types/integrations/integrations';

export const forwardIntegrationEventsToWindows = (
  apiAuthService: ApiAuthService
) => {
  sendObservablesToWindows({
    [IntegrationSubscriptionTopics.ApiAuthorizationStarted]:
      apiAuthService.apiAuthStarted$,
    [IntegrationSubscriptionTopics.ApiAuthorized]:
      apiAuthService.apiAuthorized$,
  });
};
