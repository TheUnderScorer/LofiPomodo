import React, { FC, useCallback } from 'react';
import {
  TrelloBoard,
  TrelloSettings,
} from '../../../../../shared/types/integrations/trello';
import { ManagableList } from '../../../../ui/molecules/managableList/ManagableList';
import { TrelloBoardListItem } from './trelloBoardListItem/TrelloBoardListItem';
import { useFieldArray, useFormContext } from 'react-hook-form';

export interface ManageTrelloBoardsProps {
  boards: TrelloBoard[];
}

export const ManageTrelloBoards: FC<ManageTrelloBoardsProps> = ({ boards }) => {
  const form = useFormContext<TrelloSettings>();

  const { append, fields, remove } = useFieldArray<TrelloBoard>({
    control: form.control,
    name: 'boards',
    keyName: 'id',
  });

  const handleAdd = useCallback(() => {
    append({});
  }, [append]);

  return (
    <ManagableList
      width="100%"
      addItemText="Add board settings"
      onAdd={handleAdd}
      onRemove={remove}
      items={fields}
      render={({ item, index, removeBtn }) => (
        <TrelloBoardListItem
          defaultValue={item}
          selectAppend={removeBtn}
          isLast={fields.length === index + 1}
          mb={6}
          index={index}
          key={item.id}
          boards={boards}
        />
      )}
    />
  );
};
