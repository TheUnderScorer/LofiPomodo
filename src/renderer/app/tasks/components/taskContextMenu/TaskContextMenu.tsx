import { MenuDivider, MenuItem } from '@chakra-ui/react';
import React, { FC, useCallback } from 'react';
import { Task } from '../../../../../shared/types/tasks';
import { Text } from '../../../../ui/atoms/text/Text';
import { useTasksRemoval } from '../../hooks/useTasksRemoval';
import { useInlineConfirm } from '../../../../shared/hooks/useInlineConfirm';
import { useUpdateTask } from '../../hooks/useUpdateTask';

export interface TaskContextMenuProps {
  task: Task;
}

export const TaskContextMenu: FC<TaskContextMenuProps> = ({ task }) => {
  const { removeTasks, loading } = useTasksRemoval();
  const { updateTask } = useUpdateTask();

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
      const currentDuration = task.estimatedPomodoroDuration ?? 0;

      let newDuration =
        action === 'increment' ? currentDuration + 1 : currentDuration - 1;

      if (newDuration < 0) {
        newDuration = 0;
      }

      await updateTask({
        ...task,
        estimatedPomodoroDuration: newDuration,
      });
    },
    [task, updateTask]
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
      <MenuItem
        className="delete-task"
        onClick={handleDeleteClick}
        color="brand.danger"
      >
        {loading ? 'Deleting...' : deleteText}
      </MenuItem>
    </>
  );
};
