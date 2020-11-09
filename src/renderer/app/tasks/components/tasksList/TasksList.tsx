import { List, ListProps } from '@chakra-ui/core';
import React, { FC } from 'react';
import { Task } from '../../../../../shared/types/tasks';
import { TaskListItem, TaskListItemProps } from './taskListItem/TaskListItem';

export interface TasksListProps extends ListProps {
  tasks: Task[];
  itemProps?: Omit<TaskListItemProps, 'task'>;
}

export const TasksList: FC<TasksListProps> = ({
  tasks,
  itemProps,
  ...props
}) => {
  return (
    <List overflow="auto" {...props}>
      {tasks.map((task) => (
        <TaskListItem mb={2} key={task.id} task={task} {...itemProps} />
      ))}
    </List>
  );
};
