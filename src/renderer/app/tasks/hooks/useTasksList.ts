import { useCallback, useEffect, useState } from 'react';
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
import { useRecoilState } from 'recoil';
import { useIpcReceiver } from '../../../shared/ipc/useIpcReceiver';

export interface TasksHookProps {
  defaultOrder?: Order<Task>;
  defaultState?: TaskState;
}

export const useTasksList = ({
  defaultOrder,
  defaultState = TaskState.Todo,
}: TasksHookProps = {}) => {
  const [state, setTaskState] = useState<TaskState>(defaultState);
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
  const [tasks, setTasks] = useRecoilState(tasksListStore);

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

  useEffect(() => {
    getTasks({
      state,
    });
  }, [getTasks, state]);

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
