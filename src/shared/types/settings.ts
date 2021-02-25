import { AppStore } from './store';

export interface AutostartSettings {
  autoStart?: boolean;
}

export interface AppSettings
  extends Pick<AppStore, 'taskSettings' | 'pomodoroSettings' | 'trello'> {
  autoStart: boolean;
}

export enum SettingsOperations {
  GetSettings = 'GetSettings',
  GetSetting = 'GetSetting',
  SetSettings = 'SetSettings',
}

export enum SettingsSubscriptionTopics {
  SettingsUpdated = 'SettingsUpdated',
}

export interface GetSettingPayload {
  key: keyof AppSettings;
}
