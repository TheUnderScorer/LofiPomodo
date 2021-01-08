import { ApiProvider } from '../../../../shared/types/integrations/integrations';
import { faTrello } from '@fortawesome/free-brands-svg-icons';
import { FaIcon } from '../../../ui/atoms/faIcon/FaIcon';
import React from 'react';

export const apiProviderIconDictionary = {
  [ApiProvider.Trello]: <FaIcon icon={faTrello} />,
};
