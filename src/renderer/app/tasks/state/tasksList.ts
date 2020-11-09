import { atom } from 'recoil';
import { Task } from '../../../../shared/types/tasks';

export const tasksListStore = atom<Task[]>({
  key: 'tasksList',
  default: [],
});
