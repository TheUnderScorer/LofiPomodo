import { ApiService } from '../types';
import {
  ApiAuthorizedResult,
  ApiProvider,
  IntegrationEvents,
  IntegrationSubscriptionTopics,
  ProviderInfo,
} from '../../../../shared/types/integrations/integrations';
import { Typed } from 'emittery';
import { ApiAuthStateService } from './ApiAuthStateService';
import { getServiceByProvider } from './getServiceByProvider';
import { shell } from 'electron';
import { Subject } from 'rxjs';

export interface ApiAuthServiceEventsMap {
  [IntegrationSubscriptionTopics.ApiAuthorizationStarted]: ProviderInfo;
  [IntegrationSubscriptionTopics.ApiAuthorized]: ApiAuthorizedResult;
}

export class ApiAuthService {
  readonly events = new Typed<ApiAuthServiceEventsMap>();

  readonly apiAuthStarted$ = new Subject<ProviderInfo>();
  readonly apiAuthorized$ = new Subject<ApiAuthorizedResult>();

  constructor(
    private readonly services: ApiService[],
    private readonly apiAuthState: ApiAuthStateService
  ) {}

  async startAuth(provider: ApiProvider) {
    this.apiAuthStarted$.next({ provider });

    await this.events.emit(
      IntegrationSubscriptionTopics.ApiAuthorizationStarted,
      {
        provider,
      }
    );

    this.apiAuthState.startApiAuth(provider);

    const url = await getServiceByProvider(
      this.services,
      provider
    ).getAuthorizationUrl();

    await shell.openExternal(url);
  }

  async handleAuthProtocol(url: string) {
    await Promise.all(
      this.services
        .filter((service) =>
          this.apiAuthState.isBeingAuthorized(service.provider)
        )
        .map(async (service) => {
          this.apiAuthState.endApiAuth(service.provider);

          const result = await service.handleAuthProtocol(url);

          if (result) {
            this.apiAuthorized$.next({
              provider: service.provider,
              token: result.token,
            });

            await this.events.emit(
              IntegrationSubscriptionTopics.ApiAuthorized,
              {
                provider: service.provider,
                token: result.token,
              }
            );
          }
        })
    );
  }
}
