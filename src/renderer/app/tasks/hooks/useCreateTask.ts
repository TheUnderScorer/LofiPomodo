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
  const { getTasks } = useTasksList();
  const { getCount } = useGroupedTasksCount();
  const { fetchActiveTask } = useActiveTask();

  const [createTask] = useIpcInvoke<CreateTaskInput, Task>(
    TaskEvents.CreateTask
  );

  const createTaskCallback = useCallback(
    async (values: CreateTaskInput) => {
      const createdTask = await createTask(values);

      await Promise.all([getTasks(), getCount(), fetchActiveTask()]);

      if (onCreate) {
        onCreate(createdTask);
      }
    },
    [createTask, fetchActiveTask, getCount, getTasks, onCreate]
  );

  return { createTask: createTaskCallback };
};
