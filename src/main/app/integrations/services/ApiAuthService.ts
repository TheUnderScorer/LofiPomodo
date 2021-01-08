import { ApiService } from '../types';
import {
  ApiAuthorizedResult,
  ApiProvider,
  IntegrationEvents,
  ProviderInfo,
} from '../../../../shared/types/integrations/integrations';
import { Typed } from 'emittery';
import { ApiAuthState } from './ApiAuthState';
import { getServiceByProvider } from './getServiceByProvider';
import { shell } from 'electron';

export interface ApiAuthServiceEventsMap {
  [IntegrationEvents.ApiAuthorizationStarted]: ProviderInfo;
  [IntegrationEvents.ApiAuthorized]: ApiAuthorizedResult;
}

export class ApiAuthService {
  readonly events = new Typed<ApiAuthServiceEventsMap>();

  constructor(
    private readonly services: ApiService[],
    private readonly apiAuthState: ApiAuthState
  ) {}

  async startAuth(provider: ApiProvider) {
    await this.events.emit(IntegrationEvents.ApiAuthorizationStarted, {
      provider,
    });

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
            await this.events.emit(IntegrationEvents.ApiAuthorized, {
              provider: service.provider,
              token: result.token,
            });
          }
        })
    );
  }
}
