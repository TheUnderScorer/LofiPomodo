import { PomodoroService } from '../../main/app/pomodoro/services/pomodoroService/PomodoroService';

export interface Pomodoro {
  start: Date;
  state: PomodoroStates;
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
  breakSound?: string;
  workSound?: string;
  longBreakSound?: string;
  showNotificationBeforeBreak?: boolean;
}

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

export interface PomodoroState extends Omit<Pomodoro, PomodoroSettingsKeys> {}

type PomodoroSettingsKeys = keyof Pick<
  Pomodoro,
  | 'longBreakInterval'
  | 'openFullWindowOnBreak'
  | 'autoRunBreak'
  | 'autoRunWork'
  | 'workDurationSeconds'
  | 'longBreakDurationSeconds'
  | 'shortBreakDurationSeconds'
  | 'breakSound'
  | 'longBreakSound'
  | 'workSound'
  | 'showNotificationBeforeBreak'
>;

export interface PomodoroSettings
  extends Pick<Pomodoro, PomodoroSettingsKeys> {}

export interface ToggleMenuPayload {
  y: number;
  x: number;
}

export interface PomodoroStateChanged {
  newState: PomodoroStates;
  oldState: PomodoroStates;
  pomodoro: PomodoroService;
  trigger: Trigger;
}

export enum Trigger {
  Manual = 'Manual',
  Scheduled = 'Scheduled',
}
