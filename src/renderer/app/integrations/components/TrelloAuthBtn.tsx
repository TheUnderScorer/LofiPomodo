import { Button } from '@chakra-ui/core';
import React, { FC, useCallback } from 'react';
import { useGetSetting } from '../../settings/hooks/useGetSetting';
import { faTrello } from '@fortawesome/free-brands-svg-icons';
import { Text } from '../../../ui/atoms/text/Text';
import { FaIcon } from '../../../ui/atoms/faIcon/FaIcon';
import { useIpcQuery } from '../../../shared/ipc/useIpcQuery';
import { IntegrationEvents } from '../../../../shared/types/integrations';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';

export interface TrelloAuthBtnProps {
  onSuccess?: (authToken: string) => any;
  onFail?: () => any;
}

export const TrelloAuthBtn: FC<TrelloAuthBtnProps> = () => {
  const { result: trelloSettings, loading: getSettingLoading } = useGetSetting(
    'trello'
  );

  const { result: authUrl, loading: loadingAuthUrl } = useIpcQuery<
    never,
    string
  >(IntegrationEvents.GetTrelloAuthUrl);

  const [authorize] = useIpcInvoke(IntegrationEvents.AuthorizeTrello);

  const handleBtnClick = useCallback(async () => {
    await authorize();
  }, [authorize]);

  return (
    <>
      {(!trelloSettings?.userToken || getSettingLoading) && (
        <Button
          variant="solid"
          isLoading={getSettingLoading || loadingAuthUrl}
          onClick={handleBtnClick}
          leftIcon={<FaIcon icon={faTrello} />}
        >
          <Text>Connect with Trello</Text>
        </Button>
      )}
    </>
  );
};
