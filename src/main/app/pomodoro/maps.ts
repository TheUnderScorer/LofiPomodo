import {
  PomodoroSettings,
  PomodoroState,
  PomodoroStateEnum,
} from '../../../shared/types';

export const nextStateMap: Record<
  PomodoroStateEnum,
  (
    pomodoroState: PomodoroState,
    pomodoroSettings: PomodoroSettings
  ) => PomodoroStateEnum
> = {
  [PomodoroStateEnum.LongBreak]: () => PomodoroStateEnum.Work,
  [PomodoroStateEnum.Break]: () => PomodoroStateEnum.Work,
  [PomodoroStateEnum.Work]: (
    pomodoroState: PomodoroState,
    pomodoroSettings: PomodoroSettings
  ) => {
    if (pomodoroState.shortBreakCount >= pomodoroSettings.longBreakInterval) {
      return PomodoroStateEnum.LongBreak;
    }

    return PomodoroStateEnum.Break;
  },
};

export const stateDurationMap: Record<
  PomodoroStateEnum,
  keyof PomodoroSettings
> = {
  [PomodoroStateEnum.Break]: 'shortBreakDurationSeconds',
  [PomodoroStateEnum.LongBreak]: 'longBreakDurationSeconds',
  [PomodoroStateEnum.Work]: 'workDurationSeconds',
};
