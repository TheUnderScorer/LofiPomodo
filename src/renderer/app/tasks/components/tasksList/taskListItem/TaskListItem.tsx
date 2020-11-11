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
import React, { FC } from 'react';
import { Task, TaskState } from '../../../../../../shared/types/tasks';
import { Draggable } from 'react-beautiful-dnd';
import { FaIcon } from '../../../../../ui/atoms/faIcon/FaIcon';
import { faGripLines } from '@fortawesome/free-solid-svg-icons';

export interface TaskListItemProps extends ListItemProps {
  task: Task;
  onTaskChange?: (task: Task) => any;
  arrIndex: number;
  isDragDisabled?: boolean;
}

export const TaskListItem: FC<TaskListItemProps> = ({
  task,
  onTaskChange,
  arrIndex,
  isDragDisabled,
  ...props
}) => {
  const handleTaskChange = <Key extends keyof Task>(
    key: Key,
    value: ((event: any) => Task[Key]) | Task[Key]
  ) => (event: any) => {
    const valueToUse = typeof value === 'function' ? value(event) : value;

    if (onTaskChange) {
      onTaskChange({
        ...task,
        [key]: valueToUse,
      });
    }
  };

  return (
    <Draggable
      isDragDisabled={isDragDisabled}
      key={task.id}
      draggableId={task.id}
      index={arrIndex}
    >
      {({ draggableProps, dragHandleProps, innerRef }) => (
        <ListItem
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
            onSubmit={handleTaskChange('title', (value) => value)}
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
              onChange={handleTaskChange('estimatedPomodoroDuration', (val) =>
                parseInt(val)
              )}
              defaultValue={task.estimatedPomodoroDuration || 0}
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
            <IconButton {...dragHandleProps} variant="ghost" aria-label="Drag">
              <FaIcon icon={faGripLines} />
            </IconButton>
          </Stack>
        </ListItem>
      )}
    </Draggable>
  );
};
