import {
  CreateTaskInput,
  Task,
  TaskOperations,
} from '../../../../shared/types/tasks';
import { useIpcMutation } from '../../../shared/ipc/useIpcMutation';

export interface CreateTaskHookProps {
  onCreate?: (task: Task) => any;
}

export const useCreateTask = ({ onCreate }: CreateTaskHookProps = {}) => {
  const createTaskMutation = useIpcMutation<CreateTaskInput, Task>(
    TaskOperations.CreateTask,
    {
      onComplete: (task) => {
        if (task && onCreate) {
          onCreate(task);
        }
      },
      invalidateQueries: [
        TaskOperations.GetTasks,
        TaskOperations.CountByState,
        TaskOperations.GetActiveTask,
      ],
    }
  );

  return {
    createTask: (input: CreateTaskInput) =>
      createTaskMutation.mutateAsync(input),
  };
};
