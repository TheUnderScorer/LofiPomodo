import { PomodoroService } from '../../main/app/pomodoro/services/pomodoroService/PomodoroService';

export enum PomodoroStates {
  Work = 'Work',
  Break = 'Break',
  LongBreak = 'LongBreak',
}

export enum PomodoroOperations {
  UpdatePomodoro = 'UpdatePomodoro',
  GetPomodoroState = 'GetPomodoroState',
  ToggleTimerMenu = 'ToggleTimerMenu',
  RestartCurrentState = 'RestartCurrentState',
  MoveToNextState = 'MoveToNextState',
  BreakSoon = 'BreakSoon',
}

export enum PomodoroSubscriptionTopics {
  PomodoroUpdated = 'PomodoroUpdated',
}

export interface PomodoroState {
  shortBreakCount: number;
  remainingSeconds: number;
  state: PomodoroStates;
  start: Date;
  remainingTime: string;
  remainingPercentage: number;
  isRunning: boolean;
  wasRunning?: boolean;
}

export interface PomodoroSettings {
  workDurationSeconds: number;
  shortBreakDurationSeconds: number;
  longBreakDurationSeconds: number;
  autoRunBreak: boolean;
  autoRunWork: boolean;
  openFullWindowOnBreak: boolean;
  breakSound?: string;
  workSound?: string;
  longBreakSound?: string;
  showNotificationBeforeBreak?: boolean;
  longBreakInterval: number;
  dndOnBreak?: boolean;
}

export interface PomodoroStateChanged {
  newState: PomodoroStates;
  oldState: PomodoroStates;
  trigger: Trigger;
}

export enum Trigger {
  Manual = 'Manual',
  Scheduled = 'Scheduled',
}
