import { PomodoroSettings } from './pomodoro';
import { TrelloSettings } from './taskProviders';

export interface AutostartSettings {
  autoStart?: boolean;
}

export interface AppSettings extends PomodoroSettings, AutostartSettings {
  trello?: TrelloSettings;
}

export enum SettingsEvents {
  GetSettings = 'GetSettings',
  GetSetting = 'GetSetting',
  SetSettings = 'SetSettings',
}

export interface GetSettingPayload {
  key: keyof AppSettings;
}
