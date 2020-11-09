import { TaskState } from '../types/tasks';

export const taskStateDictionary: Record<TaskState, string> = {
  [TaskState.Todo]: 'Todo',
  [TaskState.Completed]: 'Done',
};
