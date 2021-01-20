import { useCallback } from 'react';
import {
  Task,
  TaskEvents,
  TaskSubscriptionTopics,
} from '../../../../shared/types/tasks';
import { isTaskActive } from '../../../../shared/app/tasks/isTaskActive';
import { useIpcSubscriber } from '../../../shared/ipc/useIpcSubscriber';
import { useTasksList } from './useTasksList';
import { useActiveTask } from './useActiveTask';
import { useGroupedTasksCount } from './useGroupedTasksCount';
import { useQueryClient } from 'react-query';

export const useTasksListeners = () => {
  const { getTasks } = useTasksList();
  const { fetchActiveTask } = useActiveTask();
  const { getCount } = useGroupedTasksCount();

  const queryClient = useQueryClient();

  const handleTaskRemoved = useCallback(
    async (_: unknown, tasks: Task[]) => {
      const promises: Array<Promise<any>> = [getCount(), getTasks()];

      const hasActiveTask = tasks.some(isTaskActive);

      if (hasActiveTask) {
        promises.push(fetchActiveTask());
      }

      await Promise.all(promises);
    },
    [fetchActiveTask, getCount, getTasks]
  );
  useIpcSubscriber(TaskSubscriptionTopics.TasksDeleted, handleTaskRemoved);

  const handleActiveTaskChange = useCallback(
    async (_: undefined, task: Task) => {
      console.log(`Active task changed:`, task);
      queryClient.setQueryData(TaskEvents.GetActiveTask, task);
    },
    [queryClient]
  );
  useIpcSubscriber(
    TaskSubscriptionTopics.ActiveTaskUpdated,
    handleActiveTaskChange
  );
};
