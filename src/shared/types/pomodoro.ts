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
  autoRunBreak: boolean;
  autoRunWork: boolean;
  remainingTime: string;
  remainingPercentage: number;
  openFullWindowOnBreak: boolean;
}

export enum PomodoroState {
  Work = 'Work',
  Break = 'Break',
  LongBreak = 'LongBreak',
}

export enum PomodoroEvents {
  Updated = 'Updated',
  Update = 'Update',
  GetState = 'GetState',
  ToggleTimerMenu = 'ToggleTimerMenu',
  RestartCurrentState = 'RestartCurrentState',
  SkipBreak = 'SkipBreak',
}

export interface ToggleMenuPayload {
  y: number;
  x: number;
}
