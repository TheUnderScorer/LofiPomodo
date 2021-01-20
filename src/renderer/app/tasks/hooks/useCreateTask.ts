import {
  CreateTaskInput,
  Task,
  TaskEvents,
} from '../../../../shared/types/tasks';
import { useIpcMutation } from '../../../shared/ipc/useIpcMutation';

export interface CreateTaskHookProps {
  onCreate?: (task: Task) => any;
}

export const useCreateTask = ({ onCreate }: CreateTaskHookProps = {}) => {
  const createTaskMutation = useIpcMutation<CreateTaskInput, Task>(
    TaskEvents.CreateTask,
    {
      onComplete: (task) => {
        if (task && onCreate) {
          onCreate(task);
        }
      },
      invalidateQueries: [
        TaskEvents.GetTasks,
        TaskEvents.CountByState,
        TaskEvents.GetActiveTask,
      ],
    }
  );

  return {
    createTask: (input: CreateTaskInput) =>
      createTaskMutation.mutateAsync(input),
  };
};
