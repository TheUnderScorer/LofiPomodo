import { Task } from '../../types/tasks';

export const isTaskActive = (task: Task) => task.index === 0;
