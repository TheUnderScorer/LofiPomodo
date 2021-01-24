import { PomodoroSettings } from './pomodoro';
import { TrelloSettings } from './integrations/trello';

export interface AutostartSettings {
  autoStart?: boolean;
}

export interface AppSettings {
  trello?: TrelloSettings;
  pomodoro: PomodoroSettings;
  autoStart: boolean;
}

export enum SettingsOperations {
  GetSettings = 'GetSettings',
  GetSetting = 'GetSetting',
  SetSettings = 'SetSettings',
}

export interface GetSettingPayload {
  key: keyof AppSettings;
}
