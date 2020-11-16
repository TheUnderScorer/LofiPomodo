import {
  Checkbox,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  ListItem,
  ListItemProps,
  NumberInput,
  NumberInputField,
  Stack,
} from '@chakra-ui/core';
import React, { FC, ReactNode, useCallback } from 'react';
import { Task, TaskState } from '../../../../../../shared/types/tasks';
import { Draggable } from 'react-beautiful-dnd';
import { FaIcon } from '../../../../../ui/atoms/faIcon/FaIcon';
import { faGripLines } from '@fortawesome/free-solid-svg-icons';
import { ContextMenu } from '../../../../../ui/molecules/contextMenu/ContextMenu';

export interface TaskListItemProps extends ListItemProps {
  task: Task;
  onTaskChange?: (task: Task) => any;
  arrIndex: number;
  isDragDisabled?: boolean;
  contextMenu?: (task: Task) => ReactNode;
}

export const TaskListItem: FC<TaskListItemProps> = ({
  task,
  onTaskChange,
  arrIndex,
  isDragDisabled,
  contextMenu,
  ...props
}) => {
  const handleTaskChange = useCallback(
    <Key extends keyof Task>(
      key: Key,
      value: ((event: any) => Task[Key]) | Task[Key]
    ) => (event: any) => {
      const valueToUse = typeof value === 'function' ? value(event) : value;

      if (valueToUse === false) {
        return;
      }

      if (onTaskChange) {
        onTaskChange({
          ...task,
          [key]: valueToUse,
        });
      }
    },
    [onTaskChange, task]
  );

  return (
    <Draggable
      isDragDisabled={isDragDisabled}
      key={task.id}
      draggableId={task.id}
      index={arrIndex}
    >
      {({ draggableProps, dragHandleProps, innerRef }) => (
        <ContextMenu id={task.id} menu={contextMenu ? contextMenu(task) : null}>
          {(bag) => (
            <ListItem
              onContextMenu={bag.onContextMenu}
              ref={innerRef}
              {...props}
              {...draggableProps}
              className="task-list-item"
              alignItems="center"
              d="flex"
            >
              <Checkbox
                className="task-state-checkbox"
                onChange={handleTaskChange(
                  'state',
                  task.state === TaskState.Completed
                    ? TaskState.Todo
                    : TaskState.Completed
                )}
                defaultIsChecked={task.state === TaskState.Completed}
                size="lg"
                mr={2}
              />
              <Editable
                className="task-title-editable task-title"
                onSubmit={handleTaskChange('title', (value) =>
                  value === task.title ? false : value
                )}
                color="brand.textPrimary"
                defaultValue={task.title}
              >
                <EditablePreview color="brand.textPrimary" />
                <EditableInput />
              </Editable>
              <Stack
                direction="row"
                spacing={2}
                flex={1}
                justifyContent="flex-end"
                alignItems="center"
              >
                <NumberInput
                  onChange={handleTaskChange(
                    'estimatedPomodoroDuration',
                    (val) => parseInt(val)
                  )}
                  value={task.estimatedPomodoroDuration || 0}
                >
                  <NumberInputField
                    className="task-estimation"
                    width="40px"
                    height="40px"
                    padding="0"
                    textAlign="center"
                    borderRadius="50%"
                    borderStyle="dashed"
                  />
                </NumberInput>
                {!isDragDisabled && (
                  <IconButton
                    {...dragHandleProps}
                    variant="ghost"
                    aria-label="Drag"
                  >
                    <FaIcon icon={faGripLines} />
                  </IconButton>
                )}
              </Stack>
            </ListItem>
          )}
        </ContextMenu>
      )}
    </Draggable>
  );
};
