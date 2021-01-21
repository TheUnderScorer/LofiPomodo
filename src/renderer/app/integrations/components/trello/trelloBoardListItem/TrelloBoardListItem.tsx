import {
  Center,
  Divider,
  Flex,
  HStack,
  ListItem,
  ListItemProps,
  Select,
  Spinner,
  Stack,
} from '@chakra-ui/core';
import React, { FC, ReactNode, useCallback, useEffect, useMemo } from 'react';
import {
  TrelloBoard,
  TrelloBoardSettings,
  TrelloList,
  TrelloSettings,
} from '../../../../../../shared/types/integrations/trello';
import { useFormContext } from 'react-hook-form';
import { FormControl } from '../../../../../ui/atoms/formControl/FormControl';
import { Text } from '../../../../../ui/atoms/text/Text';
import {
  GetTrelloBoardListsArgs,
  IntegrationOperations,
} from '../../../../../../shared/types/integrations/integrations';
import { OptionSeparator } from '../../../../../ui/atoms/optionSeparator/OptionSeparator';
import { TrelloListsSelection } from './trelloListsSection/TrelloListsSection';
import { get } from 'lodash';
import { validateDuplicateTrelloBoards } from '../../../validators/validateDuplicateTrelloBoards';
import { useIpcQuery } from '../../../../../shared/ipc/useIpcQuery';

export interface TrelloBoardListItemProps extends ListItemProps {
  boards: TrelloBoard[];
  index: number;
  isLast?: boolean;
  selectAppend?: ReactNode;
  defaultValue: TrelloBoardSettings;
}

export const TrelloBoardListItem: FC<TrelloBoardListItemProps> = ({
  boards,
  index,
  isLast,
  selectAppend,
  defaultValue,
  ...props
}) => {
  const getName = useCallback(
    (field?: keyof TrelloBoardSettings) => {
      if (!field) {
        return `boards[${index}]`;
      }

      return `boards[${index}].${field}`;
    },
    [index]
  );

  const form = useFormContext<TrelloSettings>();

  const doneListId = form.watch(getName('doneListId')) as string | undefined;
  const board = form.watch(getName('boardId')) as string;

  const boardIdFieldError = useMemo(
    () => get(form.errors, getName('boardId')),
    [form.errors, getName]
  );

  const { data: fetchedLists, ...fetchListsQuery } = useIpcQuery<
    GetTrelloBoardListsArgs,
    TrelloList[]
  >(IntegrationOperations.GetTrelloBoardLists, {
    variables: {
      boardId: board,
    },
  });

  const lists = useMemo(() => {
    if (!doneListId) {
      return fetchedLists;
    }

    return fetchedLists?.filter((list) => list.id !== doneListId) ?? [];
  }, [doneListId, fetchedLists]);

  /*useEffect(() => {
    if (prevBoard && board && prevBoard !== board) {
      fetchListsQuery

        .catch(console.error);

      form.setValue(getName('listIds'), []);
    }
  }, [board, fetchLists, prevBoard, index, form, getName]);*/

  useEffect(() => {
    if (doneListId) {
      const listIds = get(form.getValues(), getName('listIds')) as
        | string[]
        | undefined;

      if (listIds?.length) {
        const newListIds = listIds.filter((listId) => listId !== doneListId);

        form.setValue(getName('listIds'), newListIds);
      }
    }
  }, [form, doneListId, getName]);

  return (
    <ListItem {...props}>
      <Stack spacing={6}>
        <FormControl
          error={boardIdFieldError?.message}
          name={getName('boardId')}
          label="Board"
        >
          <HStack alignItems="center" spacing={2}>
            <Select
              defaultValue={defaultValue.boardId}
              color="brand.textPrimary"
              ref={form.register({
                validate: {
                  duplicateTrelloBoards: validateDuplicateTrelloBoards(
                    form,
                    index
                  ),
                },
              })}
              id={getName('boardId')}
              name={getName('boardId')}
            >
              {boards.map((board) => (
                <option value={board.id} key={board.id}>
                  {board.name}
                </option>
              ))}
            </Select>
            {selectAppend}
          </HStack>
        </FormControl>
        {fetchListsQuery.isLoading && (
          <Center>
            <Spinner color="brand.primary" />
          </Center>
        )}
        {!fetchListsQuery.isLoading && (
          <Flex width="100%">
            {Boolean(lists?.length) && (
              <>
                <TrelloListsSelection
                  defaultValue={defaultValue.listIds ?? []}
                  lists={lists!}
                  name={getName('listIds')}
                />
                <FormControl
                  width="50%"
                  contentBoxProps={{
                    justifyContent: 'space-between',
                  }}
                  helperInTooltip
                  helperText={
                    <>
                      Completed tasks will be moved to this list.
                      <br />
                      <br />
                      Note: Selected list will not be selectable in "lists" on
                      the left.
                    </>
                  }
                  label="Done list"
                  name={getName('doneListId')}
                >
                  <Select
                    color="brand.textPrimary"
                    defaultValue={defaultValue!.doneListId}
                    ref={form.register()}
                    name={getName('doneListId')}
                    id={getName('doneListId')}
                  >
                    <option value="">
                      None (don't do anything with completed tasks)
                    </option>
                    <OptionSeparator />
                    {fetchedLists?.map((list) => (
                      <option value={list.id} key={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
            {!Boolean(lists?.length) && (
              <Text color="brand.danger">
                No lists found, please select different board.
              </Text>
            )}
          </Flex>
        )}
      </Stack>
      {!isLast && <Divider mt={6} />}
    </ListItem>
  );
};
