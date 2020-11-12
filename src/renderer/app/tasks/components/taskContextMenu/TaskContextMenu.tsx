import { MenuDivider, MenuItem } from '@chakra-ui/core';
import React, { FC, useCallback } from 'react';
import { Task } from '../../../../../shared/types/tasks';
import { Text } from '../../../../ui/atoms/text/Text';
import { useTasksRemoval } from '../../hooks/useTasksRemoval';
import { useInlineConfirm } from '../../../../shared/hooks/useInlineConfirm';
import { useTasksList } from '../../hooks/useTasksList';

export interface TaskContextMenuProps {
  task: Task;
}

export const TaskContextMenu: FC<TaskContextMenuProps> = ({ task }) => {
  const { removeTasks, loading } = useTasksRemoval();
  const { updateTask } = useTasksList();

  const handleTaskRemoval = useCallback(() => removeTasks([task]), [
    removeTasks,
    task,
  ]);
  const { text: deleteText, handleClick: handleDeleteClick } = useInlineConfirm(
    {
      onClick: handleTaskRemoval,
      confirmText: 'Delete?',
      actionText: 'Delete task',
    }
  );

  const changePomodoro = useCallback(
    (action: 'increment' | 'decrement') => async () => {
      await updateTask(task.id, (foundTask) => {
        const currentDuration = task.estimatedPomodoroDuration ?? 0;

        const newTask: Task = {
          ...foundTask,
          estimatedPomodoroDuration:
            action === 'increment' ? currentDuration + 1 : currentDuration - 1,
        };

        if (newTask.estimatedPomodoroDuration! < 0) {
          newTask.estimatedPomodoroDuration = 0;
        }

        return newTask;
      });
    },
    [task.estimatedPomodoroDuration, task.id, updateTask]
  );

  return (
    <>
      <MenuItem onClick={changePomodoro('increment')}>
        <Text>Add 1 pomodoro</Text>
      </MenuItem>
      <MenuItem
        disabled={!task.estimatedPomodoroDuration}
        onClick={changePomodoro('decrement')}
      >
        <Text>Remove 1 pomodoro</Text>
      </MenuItem>
      <MenuDivider />
      <MenuItem onClick={handleDeleteClick} color="brand.danger">
        {loading ? 'Deleting...' : deleteText}
      </MenuItem>
    </>
  );
};
