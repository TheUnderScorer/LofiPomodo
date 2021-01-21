import { TaskOperations, TaskState } from '../../../../shared/types/tasks';
import { useIpcQuery } from '../../../shared/ipc/useIpcQuery';

export const useGroupedTasksCount = () => {
  const getCountQuery = useIpcQuery<void, Record<TaskState, number>>(
    TaskOperations.CountByState
  );

  return {
    count: getCountQuery.data,
    getCount: getCountQuery.refetch,
  };
};
