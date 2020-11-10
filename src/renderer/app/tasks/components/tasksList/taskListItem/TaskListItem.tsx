import {
  Checkbox,
  Flex,
  ListItem,
  ListItemProps,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/core';
import React, { FC } from 'react';
import { Task, TaskState } from '../../../../../../shared/types/tasks';
import { Text } from '../../../../../ui/atoms/text/Text';

export interface TaskListItemProps extends ListItemProps {
  task: Task;
  onTaskChange?: (task: Task) => any;
}

export const TaskListItem: FC<TaskListItemProps> = ({
  task,
  onTaskChange,
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
    <ListItem
      className="task-list-item"
      alignItems="center"
      d="flex"
      {...props}
    >
      <Checkbox
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
      <Text>{task.title}</Text>
      <Flex flex={1} justifyContent="flex-end">
        <NumberInput
          onChange={handleTaskChange('estimatedPomodoroDuration', (val) =>
            parseInt(val)
          )}
          defaultValue={task.estimatedPomodoroDuration || 0}
        >
          <NumberInputField
            width="40px"
            height="40px"
            padding="0"
            textAlign="center"
            borderRadius="50%"
            borderStyle="dashed"
          />
        </NumberInput>
      </Flex>
    </ListItem>
  );
};
