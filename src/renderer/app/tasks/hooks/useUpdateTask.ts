import { useCallback } from 'react';
import { Task, TaskEvents } from '../../../../shared/types/tasks';
import { useIpcMutation } from '../../../shared/ipc/useIpcMutation';

export const useUpdateTask = () => {
  const updateTaskMutation = useIpcMutation<Task, Task>(TaskEvents.UpdateTask, {
    invalidateQueries: [
      TaskEvents.GetTasks,
      TaskEvents.CountByState,
      TaskEvents.GetActiveTask,
    ],
  });

  const updateTask = useCallback(
    async (task: Task) => {
      await updateTaskMutation.mutate(task);
    },
    [updateTaskMutation]
  );

  return {
    updateTask,
  };
};
