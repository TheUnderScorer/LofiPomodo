import { Pomodoro } from '../../../../shared/types';
import { atom } from 'recoil';

export const pomodoroState = atom<Pomodoro | null>({
  key: 'pomodoro',
  default: null,
});
