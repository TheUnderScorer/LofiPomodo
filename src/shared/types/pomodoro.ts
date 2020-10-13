export interface Pomodoro {
  start: Date;
  state: PomodoroState;
  workDurationSeconds: number;
  shortBreakDurationSeconds: number;
  longBreakDurationSeconds: number;
  longBreakInterval: number;
  shortBreakCount: number;
  remainingSeconds: number;
  isRunning: boolean;
  autoRun: boolean;
}

export enum PomodoroState {
  Work = 'Work',
  Break = 'Break',
  LongBreak = 'LongBreak',
}
