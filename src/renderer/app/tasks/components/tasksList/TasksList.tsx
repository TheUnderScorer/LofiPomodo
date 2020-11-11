import { Center, List, ListProps } from '@chakra-ui/core';
import React, { FC, ReactNode } from 'react';
import { Task } from '../../../../../shared/types/tasks';
import { Heading } from '../../../../ui/atoms/heading/Heading';
import { TaskListItem, TaskListItemProps } from './taskListItem/TaskListItem';

export interface TasksListProps extends ListProps {
  tasks: Task[];
  itemProps?: Omit<TaskListItemProps, 'task'>;
  emptyContent?: ReactNode;
  loading?: boolean;
}

export const TasksList: FC<TasksListProps> = ({
  tasks,
  itemProps,
  emptyContent,
  loading,
  ...props
}) => {
  return (
    <List className="tasks-list" h="100%" overflow="auto" {...props}>
      {(!tasks.length && !loading && emptyContent) ?? (
        <Center h="100%">
          <Heading size="sm">No tasks found.</Heading>
        </Center>
      )}
      {tasks.map((task) => (
        <TaskListItem
          className="task-list-item"
          mb={2}
          key={task.id}
          task={task}
          {...itemProps}
        />
      ))}
    </List>
  );
};
