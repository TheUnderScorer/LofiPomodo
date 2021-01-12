import React, { FC, useCallback, useState } from 'react';
import {
  TrelloBoard,
  TrelloSettings,
} from '../../../../../shared/types/integrations/trello';
import { FormProvider, useForm } from 'react-hook-form';
import { IntegrationEvents } from '../../../../../shared/types/integrations/integrations';
import { useIpcInvoke } from '../../../../shared/ipc/useIpcInvoke';
import { Box, Button, Fade, Flex, HStack } from '@chakra-ui/core';
import { Alert } from '../../../../ui/molecules/alert/Alert';
import { Text } from '../../../../ui/atoms/text/Text';
import { ManageTrelloBoards } from './ManageTrelloBoards';
import { SubmitButton } from '../../../../ui/atoms/submitButton/SubmitButton';
import { useDebounce } from 'react-use';
import { AppSystemEvents } from '../../../../../shared/types/system';

export interface ManageTrelloFormProps {
  boards: TrelloBoard[];
  trelloSettings?: TrelloSettings;
}

export const ManageTrelloForm: FC<ManageTrelloFormProps> = ({
  boards,
  trelloSettings,
}) => {
  const [close] = useIpcInvoke<never>(AppSystemEvents.CloseWindow);

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

  const [save, { loading: submitting, error }] = useIpcInvoke<TrelloSettings>(
    IntegrationEvents.SaveTrelloBoards,
    {
      onComplete: () => {
        setDidSubmit(true);
      },
    }
  );

  const handleSubmit = useCallback(
    async (values: TrelloSettings) => {
      await save({
        boards: values?.boards ?? [],
      });
    },
    [save]
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
          {error && (
            <Alert mb={6} width="50%" type="error">
              <Text>{error.message}</Text>
            </Alert>
          )}
          <ManageTrelloBoards boards={boards} />
        </Box>
        <HStack>
          <SubmitButton
            didSubmit={didSubmit}
            width="200px"
            isLoading={submitting}
            id="submit_trello"
          />
          <Button onClick={() => close()}>
            <Text>Close</Text>
          </Button>
        </HStack>
      </FormProvider>
    </Flex>
  );
};
