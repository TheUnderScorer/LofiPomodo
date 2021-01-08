import React, { FC } from 'react';
import { CenterContainer } from '../../../../ui/templates/centerContainer/CenterContainer';
import {
  TitleBar,
  titleBarHeight,
} from '../../../../ui/molecules/titleBar/TitleBar';
import { TrelloBoard } from '../../../../../shared/types/integrations/trello';
import { IntegrationEvents } from '../../../../../shared/types/integrations/integrations';
import { Center, Spinner } from '@chakra-ui/core';
import { useIpcQuery } from '../../../../shared/ipc/useIpcQuery';
import { ManageTrello } from '../../components/trello/ManageTrello';

export interface ManageTrelloViewProps {}

export const ManageTrelloView: FC<ManageTrelloViewProps> = () => {
  const { result, loading } = useIpcQuery<never, TrelloBoard[]>(
    IntegrationEvents.GetTrelloBoards
  );

  return (
    <>
      <TitleBar pageTitle="Manage trello" position="relative" />
      <CenterContainer>
        {loading && (
          <Center h="100%">
            <Spinner color="brand.primary" />
          </Center>
        )}
        {result && !loading && (
          <ManageTrello
            height={`calc(100% - ${titleBarHeight})`}
            boards={result}
          />
        )}
      </CenterContainer>
    </>
  );
};
