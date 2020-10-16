import { Pomodoro, PomodoroState } from '../../../shared/types';

export const getInitialPomodoro = (): Pomodoro => ({
  shortBreakDurationSeconds: 5,
  longBreakDurationSeconds: 15,
  remainingSeconds: 10,
  start: new Date(),
  state: PomodoroState.Work,
  workDurationSeconds: 10,
  isRunning: false,
  longBreakInterval: 4,
  shortBreakCount: 0,
  autoRun: false,
  remainingTime: '',
  remainingPercentage: 0,
});
