import { useCallback } from 'react';
import { Task, TaskEvents } from '../../../../shared/types/tasks';
import { isTaskActive } from '../../../../shared/app/tasks/isTaskActive';
import { useIpcSubscriber } from '../../../shared/ipc/useIpcSubscriber';
import { useTasksList } from './useTasksList';
import { useActiveTask } from './useActiveTask';
import { useGroupedTasksCount } from './useGroupedTasksCount';
import { useSetRecoilState } from 'recoil';
import { activeTaskAtom } from '../state/activeTask';

export const useTasksListeners = () => {
  const { getTasks } = useTasksList();
  const { fetchActiveTask } = useActiveTask();
  const { getCount } = useGroupedTasksCount();

  const setActiveTask = useSetRecoilState(activeTaskAtom);

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
  useIpcSubscriber(TaskEvents.TasksDeleted, handleTaskRemoved);

  const handleActiveTaskChange = useCallback(
    async (_: undefined, task: Task) => {
      if (isTaskActive(task)) {
        setActiveTask(task);
      }
    },
    [setActiveTask]
  );
  useIpcSubscriber(TaskEvents.TaskUpdated, handleActiveTaskChange);
};
