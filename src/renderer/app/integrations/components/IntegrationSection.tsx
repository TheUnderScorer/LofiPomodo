import React, { FC, useCallback } from 'react';
import {
  ApiProvider,
  IntegrationOperations,
  ProviderInfo,
} from '../../../../shared/types/integrations/integrations';
import { useProviderAuthState } from '../hooks/useProviderAuthState';
import { Text } from '../../../ui/atoms/text/Text';
import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from '@chakra-ui/core';
import { apiProviderIconDictionary } from '../dictionaries/apiProviderIconDictionary';
import { apiProviderLabelDictionary } from '../../../../shared/dictionary/integration';
import { useIpcMutation } from '../../../shared/ipc/useIpcMutation';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FaIcon } from '../../../ui/atoms/faIcon/FaIcon';

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

  const authorizeMutation = useIpcMutation<ProviderInfo>(
    IntegrationOperations.AuthorizeApi,
    {
      variables: {
        provider,
      },
    }
  );

  const unAuthorizeMutation = useIpcMutation<ProviderInfo>(
    IntegrationOperations.UnauthorizeApi,
    {
      invalidateQueries: [IntegrationOperations.GetAuthState],
    }
  );

  const handleBtnClick = useCallback(async () => {
    if (!token) {
      await authorizeMutation.mutateAsync({ provider });

      if (onStart) {
        onStart();
      }

      return;
    }

    if (onManage) {
      onManage(token);
    }
  }, [token, onManage, authorizeMutation, provider, onStart]);

  const handleUnauthorize = useCallback(async () => {
    await unAuthorizeMutation.mutateAsync({
      provider,
    });
  }, [provider, unAuthorizeMutation]);

  return (
    <Stack spacing={2} direction="row" alignItems="center" width="100%">
      {apiProviderIconDictionary[provider]}
      <Text>{apiProviderLabelDictionary[provider]}</Text>
      <HStack
        alignItems="center"
        spacing={4}
        justifyContent="flex-end"
        flex="1"
      >
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
        {token && (
          <Menu isLazy>
            <MenuButton
              className={`${provider}-menu-btn`}
              isDisabled={unAuthorizeMutation.isLoading}
              type="button"
            >
              <FaIcon icon={faEllipsisV} />
            </MenuButton>
            <MenuList>
              <MenuItem
                className={`unauthorize-${provider}`}
                onClick={handleUnauthorize}
              >
                <Text>Unauthorize</Text>
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>
    </Stack>
  );
};
