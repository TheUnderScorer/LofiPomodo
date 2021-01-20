import { useCallback } from 'react';
import { Task, TaskEvents } from '../../../../shared/types/tasks';
import { useIpcMutation } from '../../../shared/ipc/useIpcMutation';

export const useTasksRemoval = () => {
  const removeTasksMutation = useIpcMutation<string[]>(TaskEvents.DeleteTasks, {
    invalidateQueries: [
      TaskEvents.GetActiveTask,
      TaskEvents.CountByState,
      TaskEvents.GetTasks,
    ],
  });

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
