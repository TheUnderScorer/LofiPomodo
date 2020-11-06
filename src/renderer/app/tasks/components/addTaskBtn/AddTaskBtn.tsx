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
import { extendsTheme } from '../../../../shared/theme/extendsTheme';

export interface AddTaskBtnProps extends Omit<IconButtonProps, 'aria-label'> {}

export const AddTaskBtn: FC<AddTaskBtnProps> = extendsTheme<AddTaskBtnProps>(
  (theme, colorMode) => ({
    ...theme,
    colors: {
      ...theme.colors,
      brand: {
        ...theme.colors.brand,
        textPrimary:
          colorMode === 'dark' ? theme.colors.white : theme.colors.black,
      },
    },
    styles: {
      global: {
        body: {
          color: 'white',
        },
      },
    },
  })
)((props) => {
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
          <FaIcon icon={faPlus} color="white" />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent color="brand.textPrimary">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Add task</PopoverHeader>
        <TaskForm
          wrapperProps={{
            pt: '10px',
          }}
          footerProps={{
            pb: '10px',
          }}
          onSubmit={() => toggleOpen(false)}
          Wrapper={PopoverBody}
          Footer={PopoverFooter}
        />
      </PopoverContent>
    </Popover>
  );
});
