import { useCallback, useState } from 'react';
import { Order } from '../../../../shared/types/database';
import {
  GetTasksPayload,
  Task,
  TaskEvents,
  TaskState,
} from '../../../../shared/types/tasks';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { getById } from '../../../../shared/utils/getters';
import { tasksListStore } from '../state/tasksList';
import { atom, useRecoilState } from 'recoil';

export interface TasksHookProps {
  defaultOrder?: Order<Task>;
}

const stateAtom = atom<TaskState>({
  default: TaskState.Todo,
  key: 'taskState',
});

export const useTasksList = ({ defaultOrder }: TasksHookProps = {}) => {
  const [state, setTaskState] = useRecoilState(stateAtom);
  const [order, setOrder] = useState<Order<Task> | undefined>(defaultOrder);

  const [updateTaskMutation] = useIpcInvoke<Task, Task>(TaskEvents.UpdateTask);
  const [getTasks, { error, loading, didFetch }] = useIpcInvoke<
    GetTasksPayload,
    Task[]
  >(TaskEvents.GetTasks, {
    recoilAtom: tasksListStore,
    invokeAtMount: true,
    variables: {
      state,
      order,
    },
  });
  const [tasks] = useRecoilState(tasksListStore);

  const updateTask = useCallback(
    async (id: string, callback: (taskToUpdate: Task) => Task) => {
      const task = getById(tasks ?? [], id);

      if (!task) {
        throw new Error(`Unable to update - no task found with id ${id}.`);
      }

      const updatedTask = callback(task);

      await updateTaskMutation(updatedTask);

      // Re-fetch tasks after update
      await getTasks();
    },
    [getTasks, tasks, updateTaskMutation]
  );

  return {
    order,
    setOrder,
    tasks,
    error,
    getTasks,
    loading,
    updateTask,
    state,
    setTaskState,
    didFetch,
  };
};
