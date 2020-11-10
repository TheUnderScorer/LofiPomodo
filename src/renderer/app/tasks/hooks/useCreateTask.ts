import { useCallback } from 'react';
import {
  CreateTaskInput,
  Task,
  TaskEvents,
} from '../../../../shared/types/tasks';
import { useTasksList } from './useTasksList';
import { useGroupedTasksCount } from './useGroupedTasksCount';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { useActiveTask } from './useActiveTask';

export interface CreateTaskHookProps {
  onCreate?: (task: Task) => any;
}

export const useCreateTask = ({ onCreate }: CreateTaskHookProps = {}) => {
  const { setActiveTask } = useActiveTask();
  const { getTasks } = useTasksList();
  const { getCount } = useGroupedTasksCount();
  const [createTask] = useIpcInvoke<CreateTaskInput, Task>(
    TaskEvents.CreateTask
  );

  const createTaskCallback = useCallback(
    async (values: CreateTaskInput) => {
      const createdTask = await createTask(values);

      await setActiveTask(createdTask);
      await Promise.all([getTasks(), getCount()]);

      if (onCreate) {
        onCreate(createdTask);
      }
    },
    [createTask, getCount, getTasks, onCreate, setActiveTask]
  );

  return { createTask: createTaskCallback };
};
