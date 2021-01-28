import { PomodoroSettings } from '../../../../shared/types';

export type SettingTab = 'Pomodoro' | 'Integrations' | 'General';

export interface SettingsFormViewProps {}

export interface SettingsFormInput {
  autoStart: boolean;
  pomodoroSettings: PomodoroSettings;
}
