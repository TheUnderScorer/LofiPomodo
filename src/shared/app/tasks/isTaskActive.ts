import { Task, TaskState } from '../../types/tasks';

export const isTaskActive = (task: Task) =>
  task.active && task.state === TaskState.Todo;
