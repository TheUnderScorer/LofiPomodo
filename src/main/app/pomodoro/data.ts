import {
  Pomodoro,
  PomodoroSettings,
  PomodoroState,
  PomodoroStateEnum,
} from '../../../shared/types';
import { getBoolEnv, getIntEnv } from '../../../shared/env';
import { durations } from './const/durations';

export const getInitialPomodoro = (): Pomodoro => ({
  ...getInitialPomodoroState(),
  ...getInitialPomodoroSettings(),
});

export const getInitialPomodoroState = (): PomodoroState => ({
  remainingSeconds: getIntEnv('WORK_DURATION_SECONDS', durations[6].seconds),
  start: new Date(),
  state: PomodoroStateEnum.Work,
  isRunning: false,
  shortBreakCount: 0,
  remainingTime: '',
  remainingPercentage: 0,
});

export const getInitialPomodoroSettings = (): PomodoroSettings => ({
  shortBreakDurationSeconds: getIntEnv(
    'SHORT_BREAK_DURATION_SECONDS',
    durations[1].seconds
  ),
  longBreakDurationSeconds: getIntEnv(
    'LONG_BREAK_DURATION_SECONDS',
    durations[4].seconds
  ),
  workDurationSeconds: getIntEnv('WORK_DURATION_SECONDS', durations[6].seconds),
  longBreakInterval: getIntEnv('LONG_BREAK_INTERVAL', 4),
  autoRunWork: getBoolEnv('AUTO_RUN_WORK', false),
  autoRunBreak: getBoolEnv('AUTO_RUN_BREAK', false),
  openFullWindowOnBreak: getBoolEnv('OPEN_FULL_WINDOW_ON_BREAK', false),
});
