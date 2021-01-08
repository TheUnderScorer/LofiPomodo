import {
  ApiProvider,
  AuthState,
  IntegrationEvents,
  ProviderInfo,
} from '../../../../shared/types/integrations/integrations';
import { useIpcQuery } from '../../../shared/ipc/useIpcQuery';
import { useCallback, useState } from 'react';
import { useIpcReceiver } from '../../../shared/ipc/useIpcReceiver';
import { filterApiProvider } from '../ipcFilters/filterApiProvider';
import { Nullable } from '../../../../shared/types';

export const useProviderAuthState = (provider: ApiProvider) => {
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const [token, setToken] = useState<Nullable<string>>(null);

  const { loading, refetch } = useIpcQuery<ProviderInfo, AuthState>(
    IntegrationEvents.GetAuthState,
    {
      variables: {
        provider,
      },
      onComplete: (result) => {
        setIsAuthorizing(Boolean(result?.isAuthorizing));
        setToken(result?.token ?? null);
      },
    }
  );

  const handleEnd = useCallback(async () => {
    setIsAuthorizing(false);

    await refetch();
  }, [refetch]);

  const handleStart = useCallback(() => {
    setIsAuthorizing(true);
  }, []);

  useIpcReceiver(
    IntegrationEvents.ApiAuthorizationStarted,
    filterApiProvider(provider, handleStart)
  );

  useIpcReceiver(
    IntegrationEvents.ApiAuthorized,
    filterApiProvider(provider, handleEnd)
  );

  useIpcReceiver(
    IntegrationEvents.ApiAuthorizationFailed,
    filterApiProvider(provider, handleEnd)
  );

  return {
    loading,
    isAuthorizing: isAuthorizing,
    token,
  };
};
