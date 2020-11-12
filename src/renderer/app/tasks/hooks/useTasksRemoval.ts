import { useCallback } from 'react';
import { Task, TaskEvents } from '../../../../shared/types/tasks';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';

export const useTasksRemoval = () => {
  const [removeTasksMutation, { loading, error }] = useIpcInvoke<string[]>(
    TaskEvents.DeleteTasks
  );

  const removeTasks = useCallback(
    async (tasks: Array<Task | string>) => {
      const ids = tasks.map((task) =>
        typeof task === 'string' ? task : task.id
      );

      await removeTasksMutation(ids);
    },
    [removeTasksMutation]
  );

  return {
    removeTasks,
    loading,
    error,
  };
};
