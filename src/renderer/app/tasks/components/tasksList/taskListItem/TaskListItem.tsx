import {
  Box,
  Checkbox,
  Editable,
  EditableInput,
  EditablePreview,
  ListItem,
  ListItemProps,
  NumberInput,
  NumberInputField,
  Stack,
} from '@chakra-ui/core';
import React, { FC, ReactNode, useCallback, useState } from 'react';
import { Task, TaskState } from '../../../../../../shared/types/tasks';
import { Draggable } from 'react-beautiful-dnd';
import { FaIcon } from '../../../../../ui/atoms/faIcon/FaIcon';
import { faGripLines } from '@fortawesome/free-solid-svg-icons';
import { ContextMenu } from '../../../../../ui/molecules/contextMenu/ContextMenu';
import { useDebounce, usePrevious } from 'react-use';

export interface TaskListItemProps extends ListItemProps {
  task: Task;
  onTaskChange?: (task: Task) => any;
  arrIndex: number;
  isDragDisabled?: boolean;
  contextMenu?: (task: Task) => ReactNode;
  isDisabled?: boolean;
}

const maxDuration = 99;

export const TaskListItem: FC<TaskListItemProps> = ({
  task,
  onTaskChange,
  arrIndex,
  isDragDisabled,
  contextMenu,
  isDisabled,
  ...props
}) => {
  const [duration, setDuration] = useState(task.estimatedPomodoroDuration ?? 0);
  const prevDuration = usePrevious(duration);

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

  useDebounce(
    () => {
      if (
        onTaskChange &&
        !Number.isNaN(duration) &&
        duration !== prevDuration
      ) {
        onTaskChange({
          ...task,
          estimatedPomodoroDuration: duration,
        });
      }
    },
    500,
    [onTaskChange, duration]
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
                transition="none"
                isDisabled={isDisabled}
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
                isDisabled={isDisabled}
                maxWidth="70%"
                className="task-title-editable task-title"
                onSubmit={handleTaskChange('title', (value) =>
                  value === task.title ? false : value
                )}
                color="brand.textPrimary"
                defaultValue={task.title}
              >
                <EditablePreview
                  width="100%"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                  color="brand.textPrimary"
                />
                <EditableInput width="100%" />
              </Editable>
              <Stack
                direction="row"
                spacing={4}
                flex={1}
                justifyContent="flex-end"
                alignItems="center"
              >
                <NumberInput
                  onChange={(val) => {
                    const parsed = parseInt(val);

                    if (Number.isNaN(parsed)) {
                      setDuration(0);

                      return;
                    }

                    setDuration(parsed > maxDuration ? maxDuration : parsed);
                  }}
                  value={Number.isNaN(duration) ? 0 : duration}
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
                  <Box
                    textAlign="center"
                    width="35px"
                    aria-label="Drag task"
                    {...dragHandleProps}
                  >
                    <FaIcon icon={faGripLines} />
                  </Box>
                )}
              </Stack>
            </ListItem>
          )}
        </ContextMenu>
      )}
    </Draggable>
  );
};
