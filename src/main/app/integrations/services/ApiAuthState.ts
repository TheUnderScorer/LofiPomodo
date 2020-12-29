import { ApiProvider, AuthState } from '../../../../shared/types/integrations';
import { WindowFactory } from '../../../shared/windows/factories/WindowFactory';
import { dialog } from 'electron';
import { ApiService } from '../types';
import { getServiceByProvider } from './getServiceByProvider';

export class ApiAuthState {
  // Stores api providers that are being currently authorized
  readonly apisBeingAuthorized = new Set<ApiProvider>();

  // Map of timeouts related to certain api authorization
  readonly apisAuthTimeouts = new Map<ApiProvider, any>();

  constructor(
    private readonly windowFactory: WindowFactory,
    private readonly services: ApiService[]
  ) {}

  private static timeoutDialogProviderProps = {
    [ApiProvider.Trello]: {
      type: 'warning',
      message: 'Trello authorization failed, please try again.',
    },
  };

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

    if (this.windowFactory.timerWindow) {
      await dialog.showMessageBox(this.windowFactory.timerWindow, {
        ...ApiAuthState.timeoutDialogProviderProps[provider],
        type: 'warning',
      });
    }
  }

  private clearAuthTimeout(provider: ApiProvider) {
    if (this.apisAuthTimeouts.has(provider)) {
      clearTimeout(this.apisAuthTimeouts.get(provider));

      this.apisAuthTimeouts.delete(provider);
    }
  }
}
