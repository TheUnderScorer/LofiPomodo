import { atom } from 'recoil';
import { CountTasksByState, TaskState } from '../../../../shared/types/tasks';

export const groupedTasksCountStore = atom<CountTasksByState>({
  key: 'groupedTasksCount',
  default: {
    [TaskState.Todo]: 0,
    [TaskState.Completed]: 0,
  },
});
