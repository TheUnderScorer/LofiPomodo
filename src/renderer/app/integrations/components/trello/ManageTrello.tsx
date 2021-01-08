import { ListItem, UnorderedList, ListProps } from '@chakra-ui/core';
import React from 'react';
import { FC } from 'react';
import { TrelloBoard } from '../../../../../shared/types/integrations/trello';
import { Text } from '../../../../ui/atoms/text/Text';

export interface ManageTrelloProps extends ListProps {
  boards: TrelloBoard[];
}

export const ManageTrello: FC<ManageTrelloProps> = ({ boards, ...props }) => {
  return (
    <UnorderedList overflow="auto" {...props}>
      {boards.map((board) => (
        <ListItem key={board.id}>
          <Text>{board.name}</Text>
        </ListItem>
      ))}
    </UnorderedList>
  );
};
