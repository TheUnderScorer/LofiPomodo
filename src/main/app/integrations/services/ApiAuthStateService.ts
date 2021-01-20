import {
  ApiProvider,
  AuthState,
} from '../../../../shared/types/integrations/integrations';
import { ApiService } from '../types';
import { getServiceByProvider } from './getServiceByProvider';
import { Typed } from 'emittery';

export enum ApiAuthStateEvents {
  AuthTimeout = 'AuthTimeout',
}

export interface ApiAuthStateEventsPayloadMap {
  [ApiAuthStateEvents.AuthTimeout]: {
    service: ApiAuthStateService;
    provider: ApiProvider;
  };
}

export class ApiAuthStateService {
  readonly events = new Typed<ApiAuthStateEventsPayloadMap>();

  // Stores api providers that are being currently authorized
  readonly apisBeingAuthorized = new Set<ApiProvider>();

  // Map of timeouts related to certain api authorization
  readonly apisAuthTimeouts = new Map<ApiProvider, any>();

  constructor(private readonly services: ApiService[]) {}

  startApiAuth(provider: ApiProvider) {
    if (this.isBeingAuthorized(provider)) {
      this.endApiAuth(provider);
    }

    const timeoutId = setTimeout(async () => {
      await this.handleAuthTimeout(provider);
    }, 120000);
    this.apisAuthTimeouts.set(provider, timeoutId);

    this.apisBeingAuthorized.add(provider);
  }

  endApiAuth(provider: ApiProvider) {
    this.clearAuthTimeout(provider);
    this.apisBeingAuthorized.delete(provider);
  }

  isBeingAuthorized(provider: ApiProvider) {
    return this.apisBeingAuthorized.has(provider);
  }

  async getStateForProvider(provider: ApiProvider): Promise<AuthState> {
    return {
      isAuthorizing: this.apisBeingAuthorized.has(provider),
      token: await this.getTokenForProvider(provider),
    };
  }

  getTokenForProvider(provider: ApiProvider) {
    return getServiceByProvider(this.services, provider).getUserToken();
  }

  private async handleAuthTimeout(provider: ApiProvider) {
    this.apisBeingAuthorized.delete(provider);

    await this.events.emit(ApiAuthStateEvents.AuthTimeout, {
      service: this,
      provider,
    });
  }

  private clearAuthTimeout(provider: ApiProvider) {
    if (this.apisAuthTimeouts.has(provider)) {
      clearTimeout(this.apisAuthTimeouts.get(provider));

      this.apisAuthTimeouts.delete(provider);
    }
  }
}
