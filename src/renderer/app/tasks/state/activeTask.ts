import { atom } from 'recoil';
import { Task } from '../../../../shared/types/tasks';

export const activeTaskAtom = atom<Task | null>({
  default: null,
  key: 'activeTask',
});
