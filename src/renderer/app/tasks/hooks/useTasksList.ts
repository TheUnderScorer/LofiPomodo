import { useState } from 'react';
import { Order } from '../../../../shared/types/database';
import {
  GetTasksPayload,
  Task,
  TaskEvents,
} from '../../../../shared/types/tasks';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';

export interface TasksListHookProps {
  defaultCompleted?: boolean;
  defaultOrder?: Order<Task>;
}

export const useTasksList = ({
  defaultOrder,
  defaultCompleted,
}: TasksListHookProps) => {
  const [order, setOrder] = useState<Order<Task> | undefined>(defaultOrder);
  const [completed, setCompleted] = useState(defaultCompleted);

  const [getTasks, { error, result, loading }] = useIpcInvoke<
    GetTasksPayload,
    Task[]
  >(TaskEvents.GetTasks);

  return {
    order,
    setOrder,
    completed,
    setCompleted,
    tasks: result,
    error,
    getTasks,
    loading,
  };
};
