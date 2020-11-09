import {
  Checkbox,
  Flex,
  Input,
  ListItem,
  ListItemProps,
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
  return (
    <ListItem
      className="task-list-item"
      alignItems="center"
      d="flex"
      {...props}
    >
      <Checkbox
        onChange={() => {
          if (onTaskChange) {
            onTaskChange({
              ...task,
              state:
                task.state === TaskState.Completed
                  ? TaskState.Todo
                  : TaskState.Completed,
            });
          }
        }}
        isChecked={task.state === TaskState.Completed}
        size="lg"
        mr={2}
      />
      <Text>{task.title}</Text>
      <Flex flex={1} justifyContent="flex-end">
        {task.estimatedPomodoroDuration && (
          <Input
            width="40px"
            height="40px"
            padding="0"
            textAlign="center"
            borderRadius="50%"
            borderStyle="dashed"
            onChange={(event) => {
              if (onTaskChange) {
                onTaskChange({
                  ...task,
                  estimatedPomodoroDuration: parseInt(event.target.value),
                });
              }
            }}
            value={task.estimatedPomodoroDuration}
          />
        )}
      </Flex>
    </ListItem>
  );
};
