import React, { FC } from 'react';
import { ApiProvider } from '../../../../../shared/types/integrations/integrations';
import {
  IntegrationSection,
  IntegrationSectionProps,
} from '../IntegrationSection';
import { useOpenWindow } from '../../../system/hooks/useOpenWindow';
import { WindowTypes } from '../../../../../shared/types/system';

export interface TrelloSectionProps
  extends Omit<IntegrationSectionProps, 'provider'> {}

export const TrelloSection: FC<TrelloSectionProps> = (props) => {
  const { openWindow } = useOpenWindow(WindowTypes.ManageTrello);

  return (
    <>
      <IntegrationSection
        onManage={openWindow}
        provider={ApiProvider.Trello}
        {...props}
      />
    </>
  );
};
