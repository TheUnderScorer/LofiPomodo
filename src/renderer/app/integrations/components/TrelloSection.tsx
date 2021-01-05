import React, { FC } from 'react';
import { ApiProvider } from '../../../../shared/types/integrations';
import {
  IntegrationSection,
  IntegrationSectionProps,
} from './IntegrationSection';

export interface TrelloSectionProps
  extends Omit<IntegrationSectionProps, 'provider'> {}

export const TrelloSection: FC<TrelloSectionProps> = (props) => {
  return <IntegrationSection provider={ApiProvider.Trello} {...props} />;
};
