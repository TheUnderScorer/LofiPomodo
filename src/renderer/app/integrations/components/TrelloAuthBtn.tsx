import { Button } from '@chakra-ui/core';
import React, { FC, useCallback, useState } from 'react';
import { useGetSetting } from '../../settings/hooks/useGetSetting';
import { faTrello } from '@fortawesome/free-brands-svg-icons';
import { Text } from '../../../ui/atoms/text/Text';
import { FaIcon } from '../../../ui/atoms/faIcon/FaIcon';
import { IntegrationEvents } from '../../../../shared/types/integrations';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';

export interface TrelloAuthBtnProps {
  onStart?: () => any;
  onSuccess?: (authToken: string) => any;
  onFail?: () => any;
}

export const TrelloAuthBtn: FC<TrelloAuthBtnProps> = ({onStart}) => {
  const { result: trelloSettings, loading: getSettingLoading } = useGetSetting(
    'trello'
  );

  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const [authorize] = useIpcInvoke(IntegrationEvents.AuthorizeTrello);

  const handleBtnClick = useCallback(async () => {
    setIsAuthorizing(true);

    await authorize();

    if(onStart) {
      onStart();
    }
  }, [authorize, onStart]);

  return (
    <>
      {(!trelloSettings?.userToken || getSettingLoading) && (
        <Button
          variant="solid"
          isLoading={getSettingLoading || isAuthorizing}
          onClick={handleBtnClick}
          leftIcon={<FaIcon icon={faTrello} />}
          backgroundColor="brand.primary"
        >
          <Text>Connect with Trello</Text>
        </Button>
      )}
    </>
  );
};
