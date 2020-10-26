import { Pomodoro, PomodoroState } from '../../../shared/types';
import { getBoolEnv, getIntEnv } from '../../../shared/env';

export const getInitialPomodoro = (): Pomodoro => ({
  shortBreakDurationSeconds: getIntEnv('SHORT_BREAK_DURATION_SECONDS', 5),
  longBreakDurationSeconds: getIntEnv('LONG_BREAK_DURATION_SECONDS', 15),
  remainingSeconds: getIntEnv('WORK_DURATION_SECONDS', 10),
  start: new Date(),
  state: PomodoroState.Work,
  workDurationSeconds: getIntEnv('WORK_DURATION_SECONDS', 10),
  isRunning: false,
  longBreakInterval: getIntEnv('LONG_BREAK_INTERVAL', 4),
  shortBreakCount: 0,
  autoRunWork: getBoolEnv('AUTO_RUN_WORK', false),
  autoRunBreak: getBoolEnv('AUTO_RUN_BREAK', false),
  remainingTime: '',
  remainingPercentage: 0,
  openFullWindowOnBreak: false,
});
