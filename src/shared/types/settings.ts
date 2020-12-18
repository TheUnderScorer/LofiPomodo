import { PomodoroSettings } from './pomodoro';

export interface AutostartSettings {
  autoStart?: boolean;
}

export interface AppSettings extends PomodoroSettings, AutostartSettings {}

export enum SettingsEvents {
  GetSettings = 'GetSettings',
  SetSettings = 'SetSettings',
}
