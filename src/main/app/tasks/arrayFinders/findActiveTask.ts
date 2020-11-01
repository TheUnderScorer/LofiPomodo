import { Task } from '../../../../shared/types/tasks';

export const findActiveTask = (tasks: Task[]) =>
  tasks.find((task) => task.active);
