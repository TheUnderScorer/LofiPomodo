import { Task, TaskEvents } from '../../../../shared/types/tasks';
import { useIpcQuery } from '../../../shared/ipc/useIpcQuery';

export const useActiveTask = () => {
  const fetchActiveTaskQuery = useIpcQuery<never, Task | null>(
    TaskEvents.GetActiveTask
  );

  return {
    activeTask: fetchActiveTaskQuery.data,
    fetchActiveTask: fetchActiveTaskQuery.refetch,
    loading: fetchActiveTaskQuery.isLoading,
    error: fetchActiveTaskQuery.error,
  };
};
