import { Task, TaskState } from '../../types/tasks';

export const isTaskActive = (task: Task) =>
  Boolean(task.active && task.state === TaskState.Todo);
