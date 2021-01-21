import { useCallback } from 'react';
import { Task, TaskOperations } from '../../../../shared/types/tasks';
import { useIpcMutation } from '../../../shared/ipc/useIpcMutation';

export const useTasksRemoval = () => {
  const removeTasksMutation = useIpcMutation<string[]>(
    TaskOperations.DeleteTasks,
    {
      invalidateQueries: [
        TaskOperations.GetActiveTask,
        TaskOperations.CountByState,
        TaskOperations.GetTasks,
      ],
    }
  );

  const removeTasks = useCallback(
    async (tasks: Array<Task | string>) => {
      const ids = tasks.map((task) =>
        typeof task === 'string' ? task : task.id
      );

      await removeTasksMutation.mutateAsync(ids);
    },
    [removeTasksMutation]
  );

  return {
    removeTasks,
    loading: removeTasksMutation.isLoading,
    error: removeTasksMutation.error,
  };
};
