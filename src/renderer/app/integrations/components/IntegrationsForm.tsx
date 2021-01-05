import { FC } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { AppSettings } from '../../../../shared/types/settings';
import { Stack } from '@chakra-ui/core';
import { TrelloSection } from './TrelloSection';

export interface IntegrationsFormProps {
  form: UseFormMethods<AppSettings>;
}

export const IntegrationsForm: FC<IntegrationsFormProps> = ({ form }) => {
  return (
    <Stack spacing={6} width="70%">
      <TrelloSection />
    </Stack>
  );
};
