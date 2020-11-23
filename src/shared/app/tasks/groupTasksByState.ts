import { Task, TasksByState, TaskState } from '../../types/tasks';

export const groupTasksByState = (tasks: Task[]) =>
  tasks.reduce<TasksByState>(
    (value, task) => {
      value[task.state].push(task);

      return value;
    },
    {
      [TaskState.Completed]: [],
      [TaskState.Todo]: [],
    } as TasksByState
  );
