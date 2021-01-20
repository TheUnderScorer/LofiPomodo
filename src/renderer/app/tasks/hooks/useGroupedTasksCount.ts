import { TaskEvents, TaskState } from '../../../../shared/types/tasks';
import { useIpcQuery } from '../../../shared/ipc/useIpcQuery';

export const useGroupedTasksCount = () => {
  const getCountQuery = useIpcQuery<void, Record<TaskState, number>>(
    TaskEvents.CountByState
  );

  return {
    count: getCountQuery.data,
    getCount: getCountQuery.refetch,
  };
};
