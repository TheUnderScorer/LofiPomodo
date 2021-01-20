import React, { FC, useCallback } from 'react';
import {
  ApiProvider,
  IntegrationEvents,
  ProviderInfo,
} from '../../../../shared/types/integrations/integrations';
import { useProviderAuthState } from '../hooks/useProviderAuthState';
import { Text } from '../../../ui/atoms/text/Text';
import { Button, Flex, Stack } from '@chakra-ui/core';
import { apiProviderIconDictionary } from '../dictionaries/apiProviderIconDictionary';
import { apiProviderLabelDictionary } from '../../../../shared/dictionary/integration';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';

export interface IntegrationSectionProps {
  provider: ApiProvider;
  onStart?: () => any;
  onManage?: (token: string) => any;
}

export const IntegrationSection: FC<IntegrationSectionProps> = ({
  provider,
  onStart,
  onManage,
}) => {
  const { loading: authStateLoading, token } = useProviderAuthState(provider);

  const [authorize] = useIpcInvoke<ProviderInfo>(
    IntegrationEvents.AuthorizeApi,
    {
      variables: {
        provider,
      },
    }
  );

  const handleBtnClick = useCallback(async () => {
    if (!token) {
      await authorize();

      if (onStart) {
        onStart();
      }

      return;
    }

    if (onManage) {
      onManage(token);
    }
  }, [authorize, onStart, token, onManage]);

  return (
    <Stack spacing={2} direction="row" alignItems="center" width="100%">
      {apiProviderIconDictionary[provider]}
      <Text>{apiProviderLabelDictionary[provider]}</Text>
      <Flex justifyContent="flex-end" flex="1">
        <Button
          className={`manage-${provider}`}
          id={`manage_${provider}`}
          variant="solid"
          isLoading={authStateLoading}
          onClick={handleBtnClick}
          backgroundColor="brand.primary"
        >
          <Text>{token ? 'Manage' : 'Authorize'}</Text>
        </Button>
      </Flex>
    </Stack>
  );
};
