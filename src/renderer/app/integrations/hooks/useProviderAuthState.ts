import {
  ApiProvider,
  AuthState,
  IntegrationEvents,
  IntegrationSubscriptionTopics,
  ProviderInfo,
} from '../../../../shared/types/integrations/integrations';
import { useIpcQuery } from '../../../shared/ipc/useIpcQuery';
import { useCallback, useState } from 'react';
import { useIpcSubscriber } from '../../../shared/ipc/useIpcSubscriber';
import { filterApiProvider } from '../ipcFilters/filterApiProvider';
import { Nullable } from '../../../../shared/types';

export const useProviderAuthState = (provider: ApiProvider) => {
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const [token, setToken] = useState<Nullable<string>>(null);

  const { isLoading, refetch } = useIpcQuery<ProviderInfo, AuthState>(
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

  useIpcSubscriber(
    IntegrationSubscriptionTopics.ApiAuthorizationStarted,
    filterApiProvider(provider, handleStart)
  );

  useIpcSubscriber(
    IntegrationSubscriptionTopics.ApiAuthorized,
    filterApiProvider(provider, handleEnd)
  );

  useIpcSubscriber(
    IntegrationSubscriptionTopics.ApiAuthorizationFailed,
    filterApiProvider(provider, handleEnd)
  );

  return {
    loading: isLoading,
    isAuthorizing: isAuthorizing,
    token,
  };
};
