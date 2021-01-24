import { useCallback } from 'react';
import { Task, TaskOperations } from '../../../../shared/types/tasks';
import { useIpcMutation } from '../../../shared/ipc/useIpcMutation';

export const useUpdateTask = () => {
  const updateTaskMutation = useIpcMutation<Task, Task>(
    TaskOperations.UpdateTask,
    {
      invalidateQueries: [
        TaskOperations.GetTasks,
        TaskOperations.CountByState,
        TaskOperations.GetActiveTask,
      ],
    }
  );

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
