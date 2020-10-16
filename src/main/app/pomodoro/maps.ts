import { Pomodoro, PomodoroState } from '../../../shared/types';

export const nextStateMap: Record<
  PomodoroState,
  (pomodoro: Pomodoro) => PomodoroState
> = {
  [PomodoroState.LongBreak]: () => PomodoroState.Work,
  [PomodoroState.Break]: () => PomodoroState.Work,
  [PomodoroState.Work]: (pomodoro) => {
    if (pomodoro.shortBreakCount >= pomodoro.longBreakInterval - 1) {
      return PomodoroState.LongBreak;
    }

    return PomodoroState.Break;
  },
};
export const stateDurationMap: Record<PomodoroState, keyof Pomodoro> = {
  [PomodoroState.Break]: 'shortBreakDurationSeconds',
  [PomodoroState.LongBreak]: 'longBreakDurationSeconds',
  [PomodoroState.Work]: 'workDurationSeconds',
};
