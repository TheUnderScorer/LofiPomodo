import { AppStore } from './store';

export interface AutostartSettings {
  autoStart?: boolean;
}

export interface AppSettings extends AppStore {
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
