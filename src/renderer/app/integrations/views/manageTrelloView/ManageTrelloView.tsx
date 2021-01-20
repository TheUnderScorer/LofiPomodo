import React, { FC } from 'react';
import { CenterContainer } from '../../../../ui/templates/centerContainer/CenterContainer';
import { TitleBar } from '../../../../ui/molecules/titleBar/TitleBar';
import { TrelloBoard } from '../../../../../shared/types/integrations/trello';
import { IntegrationEvents } from '../../../../../shared/types/integrations/integrations';
import { Center, Spinner } from '@chakra-ui/core';
import { useIpcQuery } from '../../../../shared/ipc/useIpcQuery';
import { Alert } from '../../../../ui/molecules/alert/Alert';
import { Text } from '../../../../ui/atoms/text/Text';
import { useGetSetting } from '../../../settings/hooks/useGetSetting';
import { ManageTrelloForm } from '../../components/trello/ManageTrelloForm';
import { CloseWindowButton } from '../../../system/components/CloseWindowButton';

export interface ManageTrelloViewProps {}

export const ManageTrelloView: FC<ManageTrelloViewProps> = () => {
  const { loading: settingLoading, result: trelloSettings } = useGetSetting(
    'trello'
  );

  const { result, loading: queryLoading } = useIpcQuery<never, TrelloBoard[]>(
    IntegrationEvents.GetTrelloBoards
  );

  const loading = queryLoading || settingLoading;

  return (
    <>
      <TitleBar mb={6} pageTitle="Manage trello" position="relative" />
      <CenterContainer>
        {loading && (
          <Center h="100%">
            <Spinner color="brand.primary" />
          </Center>
        )}
        {!result?.length && !queryLoading && (
          <Alert type="warning">
            <Text>No boards found.</Text>
          </Alert>
        )}
        {Boolean(result?.length) && !loading && (
          <ManageTrelloForm
            additionalButtons={(form) => (
              <CloseWindowButton isDirty={form.formState.isDirty} />
            )}
            boards={result!}
            trelloSettings={trelloSettings!}
          />
        )}
      </CenterContainer>
    </>
  );
};
