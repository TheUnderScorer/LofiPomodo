import { useCallback } from 'react';
import { useGroupedTasksCount } from './useGroupedTasksCount';
import { Task, TaskEvents } from '../../../../shared/types/tasks';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { useTasksList } from './useTasksList';
import { useActiveTask } from './useActiveTask';

export const useUpdateTask = () => {
  const { getTasks } = useTasksList();
  const { getCount } = useGroupedTasksCount();
  const { fetchActiveTask } = useActiveTask();

  const [updateTaskMutation] = useIpcInvoke<Task, Task>(TaskEvents.UpdateTask);

  const updateTask = useCallback(
    async (task: Task) => {
      await updateTaskMutation(task);

      await Promise.all([getTasks(), getCount(), fetchActiveTask()]);
    },
    [fetchActiveTask, getCount, getTasks, updateTaskMutation]
  );

  return {
    updateTask,
  };
};
