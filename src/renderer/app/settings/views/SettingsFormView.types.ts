import { PomodoroSettings } from '../../../../shared/types';

export type SettingTab = 'Pomodoro' | 'Integrations';

export interface SettingsFormViewProps {}

export interface SettingsFormInput {
  autoStart: boolean;
  pomodoroSettings: PomodoroSettings;
}
