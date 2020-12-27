import { useCallback } from 'react';
import { Task, TaskEvents, TaskState } from '../../../../shared/types/tasks';
import { isTaskActive } from '../../../../shared/app/tasks/isTaskActive';
import { useIpcReceiver } from '../../../shared/ipc/useIpcReceiver';
import { useTasksList } from './useTasksList';
import { useActiveTask } from './useActiveTask';
import { useGroupedTasksCount } from './useGroupedTasksCount';
import { tasksListStore } from '../state/tasksList';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { activeTask } from '../state/activeTask';

export const useTasksListeners = () => {
  const { getTasks } = useTasksList();
  const { fetchActiveTask } = useActiveTask();
  const { getCount } = useGroupedTasksCount();

  const [tasks, setTasks] = useRecoilState(tasksListStore);
  const setActiveTask = useSetRecoilState(activeTask);

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
  useIpcReceiver(TaskEvents.TasksDeleted, handleTaskRemoved);

  // Sync task changes in bg with store
  const handleTaskChange = useCallback(
    (_: any, task: Task) => {
      const index = tasks?.findIndex((storedTask) => storedTask.id === task.id);

      if (index > -1) {
        const newTasks = [...tasks];
        newTasks[index] = task;

        setTasks(newTasks);
      }
    },
    [setTasks, tasks]
  );
  useIpcReceiver(TaskEvents.TaskUpdated, handleTaskChange);

  const handleActiveTaskChange = useCallback(
    (_: undefined, task: Task) => {
      if (isTaskActive(task)) {
        if (task.state === TaskState.Todo) {
          setActiveTask(task);
        } else {
          setActiveTask(null);
        }
      }
    },
    [setActiveTask]
  );
  useIpcReceiver(TaskEvents.TaskUpdated, handleActiveTaskChange);
};