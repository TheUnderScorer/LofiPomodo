import { useState } from 'react';
import { Order } from '../../../../shared/types/database';
import {
  GetTasksPayload,
  Task,
  TaskEvents,
  TaskState,
} from '../../../../shared/types/tasks';
import { atom, useRecoilState } from 'recoil';
import { useIpcQuery } from '../../../shared/ipc/useIpcQuery';

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

  const getTasksQuery = useIpcQuery<GetTasksPayload, Task[]>(
    TaskEvents.GetTasks,
    {
      variables: {
        state,
        order,
      },
    }
  );

  return {
    order,
    setOrder,
    tasks: getTasksQuery.data,
    error: getTasksQuery.error,
    getTasks: getTasksQuery.refetch,
    loading: getTasksQuery.isLoading,
    state,
    setTaskState,
    didFetch: getTasksQuery.isFetchedAfterMount,
  };
};
