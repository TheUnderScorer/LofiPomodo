import { FC } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { AppSettings } from '../../../../shared/types/settings';
import { Stack } from '@chakra-ui/core';
import { TrelloAuthBtn } from './TrelloAuthBtn';

export interface IntegrationsFormProps {
  form: UseFormMethods<AppSettings>;
}

export const IntegrationsForm: FC<IntegrationsFormProps> = ({ form }) => {
  return (
    <Stack spacing={6}>
      <TrelloAuthBtn />
    </Stack>
  );
};
