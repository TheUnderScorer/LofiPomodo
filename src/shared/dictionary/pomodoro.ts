import { PomodoroStateEnum } from '../types';

export const pomodoroStateDictionary = {
  [PomodoroStateEnum.Work]: 'Work',
  [PomodoroStateEnum.LongBreak]: 'Long Break',
  [PomodoroStateEnum.Break]: 'Break',
};
