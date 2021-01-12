import { Button, IconButton, List, ListItem, ListProps } from '@chakra-ui/core';
import React, { ReactNode, useCallback } from 'react';
import { Text } from '../../atoms/text/Text';
import { FaIcon } from '../../atoms/faIcon/FaIcon';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

export interface RenderItemBag<T> {
  item: T;
  index: number;
  removeBtn: ReactNode;
}

export interface ManagableListProps<T> extends ListProps {
  items: T[];
  render: (bag: RenderItemBag<T>) => ReactNode;
  onAdd?: () => any;
  onRemove?: (index: number, item: T) => any;
  addItemText?: string;
  addDisabled?: boolean;
}

export const ManagableList = <T extends any>({
  items,
  render,
  onAdd,
  onRemove,
  addItemText = 'Add item',
  addDisabled = false,
  ...props
}: ManagableListProps<T>) => {
  const handleRemove = useCallback(
    (index: number, item: T) => {
      if (onRemove) {
        onRemove(index, item);
      }
    },
    [onRemove]
  );

  return (
    <List {...props}>
      {items.map((item, index) =>
        render({
          item,
          index,
          removeBtn: (
            <IconButton
              onClick={() => handleRemove(index, item)}
              aria-label="Remove item"
            >
              <FaIcon icon={faMinus} />
            </IconButton>
          ),
        })
      )}
      <ListItem textAlign="center">
        <Button
          leftIcon={<FaIcon icon={faPlus} />}
          isDisabled={addDisabled}
          onClick={onAdd}
        >
          <Text>{addItemText}</Text>
        </Button>
      </ListItem>
    </List>
  );
};
