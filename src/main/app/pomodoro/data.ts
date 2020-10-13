import { Pomodoro, PomodoroState } from '../../../shared/types';

export const getInitialPomodoro = (): Pomodoro => ({
  shortBreakDurationSeconds: 500,
  longBreakDurationSeconds: 800,
  remainingSeconds: 1000,
  start: new Date(),
  state: PomodoroState.Work,
  workDurationSeconds: 1000,
  isRunning: false,
  longBreakInterval: 4,
  shortBreakCount: 0,
  autoRun: false,
});
