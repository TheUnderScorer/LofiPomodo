import { Box, Center, List, ListProps } from '@chakra-ui/react';
import React, { FC, ReactNode, useCallback } from 'react';
import { Task } from '../../../../../shared/types/tasks';
import { Heading } from '../../../../ui/atoms/heading/Heading';
import { TaskListItem, TaskListItemProps } from './taskListItem/TaskListItem';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

export interface TasksListProps extends Omit<ListProps, 'arrIndex'> {
  tasks: Task[];
  itemProps?: Omit<TaskListItemProps, 'task' | 'arrIndex'>;
  emptyContent?: ReactNode;
  loading?: boolean;
  onListDragEnd?: (tasks: Task[]) => any;
  isDragDisabled?: boolean;
  isDirty?: boolean;
}

export const TasksList: FC<TasksListProps> = ({
  tasks,
  itemProps,
  emptyContent,
  loading,
  isDirty,
  onListDragEnd,
  isDragDisabled,
  ...props
}) => {
  const handleDragEnd = useCallback(
    ({ source, destination, reason }: DropResult) => {
      if (reason === 'CANCEL' || !destination || !onListDragEnd) {
        return;
      }

      const newTasks = [...tasks];
      const [removedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removedTask);

      const mappedTasks = newTasks.map((task, index) => ({
        ...task,
        index,
      }));

      onListDragEnd(mappedTasks);
    },
    [onListDragEnd, tasks]
  );

  return (
    <List className="tasks-list" h="100%" overflow="auto" {...props}>
      {(!tasks.length && !loading && emptyContent) ?? (
        <Center h="100%">
          <Heading size="sm">No tasks found.</Heading>
        </Center>
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {({ droppableProps, innerRef, placeholder }) => (
            <Box {...droppableProps} ref={innerRef}>
              {tasks.map((task, index) => (
                <TaskListItem
                  isDisabled={isDirty}
                  isDragDisabled={isDragDisabled}
                  arrIndex={index}
                  className="task-list-item"
                  mb={2}
                  key={task.id}
                  task={task}
                  {...itemProps}
                />
              ))}
              {placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </List>
  );
};
