import { ApiService } from '../types';
import {
  ApiAuthorizedResult,
  ApiProvider,
  ProviderInfo,
} from '../../../../shared/types/integrations/integrations';
import { ApiAuthStateService } from './ApiAuthStateService';
import { getServiceByProvider } from './getServiceByProvider';
import { shell } from 'electron';
import { Subject } from 'rxjs';

export class ApiAuthService {
  readonly apiAuthStarted$ = new Subject<ProviderInfo>();
  readonly apiAuthorized$ = new Subject<ApiAuthorizedResult>();
  readonly apiUnauthorized$ = new Subject<ProviderInfo>();

  constructor(
    private readonly services: ApiService[],
    private readonly apiAuthState: ApiAuthStateService
  ) {}

  async startAuth(provider: ApiProvider) {
    this.apiAuthStarted$.next({ provider });

    this.apiAuthState.startApiAuth(provider);

    const url = await getServiceByProvider(
      this.services,
      provider
    ).getAuthorizationUrl();

    await shell.openExternal(url);
  }

  async unAuthorize(provider: ApiProvider) {
    await getServiceByProvider(this.services, provider).unAuthorize();

    this.apiUnauthorized$.next({ provider });
  }

  async handleAuthProtocol(url: string) {
    console.log(`Handling url ${url} in ApiAuthService.`);

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
          }
        })
    );
  }
}
