import {
  IconButton,
  IconButtonProps,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/core';
import React, { FC } from 'react';
import { FaIcon } from '../../../../ui/atoms/faIcon/FaIcon';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useToggle } from 'react-use';
import { TaskForm } from '../../taskForm/TaskForm';

export interface AddTaskBtnProps extends Omit<IconButtonProps, 'aria-label'> {}

export const AddTaskBtn: FC<AddTaskBtnProps> = (props) => {
  const [open, toggleOpen] = useToggle(false);

  return (
    <Popover
      closeOnEsc
      returnFocusOnClose={false}
      isOpen={open}
      onClose={toggleOpen}
      onOpen={toggleOpen}
      closeOnBlur={false}
      placement="bottom"
    >
      <PopoverTrigger>
        <IconButton {...props} aria-label="Add task">
          <FaIcon icon={faPlus} />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Add task</PopoverHeader>
        <TaskForm
          onSubmit={() => toggleOpen(false)}
          Wrapper={PopoverBody}
          Footer={PopoverFooter}
        />
      </PopoverContent>
    </Popover>
  );
};
