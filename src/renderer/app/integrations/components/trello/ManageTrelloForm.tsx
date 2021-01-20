import React, { FC, ReactNode, useCallback, useState } from 'react';
import {
  TrelloBoard,
  TrelloSettings,
} from '../../../../../shared/types/integrations/trello';
import { FormProvider, useForm, UseFormMethods } from 'react-hook-form';
import { IntegrationEvents } from '../../../../../shared/types/integrations/integrations';
import { useIpcMutation } from '../../../../shared/ipc/useIpcMutation';
import { Box, Flex, HStack } from '@chakra-ui/core';
import { Alert } from '../../../../ui/molecules/alert/Alert';
import { Text } from '../../../../ui/atoms/text/Text';
import { ManageTrelloBoards } from './ManageTrelloBoards';
import { SubmitButton } from '../../../../ui/atoms/submitButton/SubmitButton';
import { useDebounce } from 'react-use';
import { SettingsEvents } from '../../../../../shared/types/settings';
import { uniqueArray } from '../../../../../shared/utils/array';

export interface ManageTrelloFormProps {
  boards: TrelloBoard[];
  trelloSettings?: TrelloSettings;
  additionalButtons?: (form: UseFormMethods<TrelloSettings>) => ReactNode;
}

export const ManageTrelloForm: FC<ManageTrelloFormProps> = ({
  boards,
  trelloSettings,
  additionalButtons,
}) => {
  const [didSubmit, setDidSubmit] = useState(false);

  const form = useForm<TrelloSettings>({
    defaultValues: {
      boards: trelloSettings?.boards ?? [
        {
          listIds: [],
          doneListId: '',
          boardId: boards[0].id,
        },
      ],
    },
    shouldUnregister: false,
  });

  const saveTrelloBoardsMutation = useIpcMutation<TrelloSettings>(
    IntegrationEvents.SaveTrelloBoards,
    {
      onComplete: () => {
        setDidSubmit(true);
      },
    }
  );

  const handleSubmit = useCallback(
    async (values: TrelloSettings) => {
      await saveTrelloBoardsMutation.mutateAsync({
        boards: (values?.boards ?? []).map((value) => ({
          ...value,
          listIds: uniqueArray(value.listIds ?? []),
        })),
      });

      form.reset(values, {
        dirtyFields: false,
        isDirty: false,
        isSubmitted: true,
      });
    },
    [form, saveTrelloBoardsMutation]
  );

  useDebounce(
    () => {
      if (didSubmit) {
        setDidSubmit(false);
      }
    },
    4000,
    [didSubmit]
  );

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      height="100%"
      width="100%"
      as="form"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <FormProvider {...form}>
        <Box
          pl={5}
          pr={5}
          height="calc(100% - 120px)"
          width="100%"
          overflow="auto"
          pb={10}
          spacing={4}
        >
          {saveTrelloBoardsMutation.error && (
            <Alert mb={6} width="50%" type="error">
              <Text>{saveTrelloBoardsMutation.error.message}</Text>
            </Alert>
          )}
          <ManageTrelloBoards boards={boards} />
        </Box>
        <HStack>
          <SubmitButton
            didSubmit={didSubmit}
            width="200px"
            isLoading={saveTrelloBoardsMutation.isLoading}
            id="submit_trello"
          />
          {additionalButtons ? additionalButtons(form) : undefined}
        </HStack>
      </FormProvider>
    </Flex>
  );
};
