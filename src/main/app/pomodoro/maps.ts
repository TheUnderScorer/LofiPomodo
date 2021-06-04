import {
  PomodoroSettings,
  PomodoroState,
  PomodoroStates,
} from '../../../shared/types';

export const nextStateMap: Record<
  PomodoroStates,
  (
    pomodoroState: PomodoroState,
    pomodoroSettings: PomodoroSettings
  ) => PomodoroStates
> = {
  [PomodoroStates.LongBreak]: () => PomodoroStates.Work,
  [PomodoroStates.Break]: () => PomodoroStates.Work,
  [PomodoroStates.Work]: (
    pomodoroState: PomodoroState,
    pomodoroSettings: PomodoroSettings
  ) => {
    if (pomodoroState.shortBreakCount >= pomodoroSettings.longBreakInterval) {
      return PomodoroStates.LongBreak;
    }

    return PomodoroStates.Break;
  },
};

export const stateDurationMap: Record<
  PomodoroStates,
  keyof PomodoroSettings
> = {
  [PomodoroStates.Break]: 'shortBreakDurationSeconds',
  [PomodoroStates.LongBreak]: 'longBreakDurationSeconds',
  [PomodoroStates.Work]: 'workDurationSeconds',
};
