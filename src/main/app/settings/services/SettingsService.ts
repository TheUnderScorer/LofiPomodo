import { AppSettings } from '../../../../shared/types/settings';
import AutoLaunch from 'auto-launch';
import { AppStore } from '../../../../shared/types/store';
import ElectronStore from 'electron-store';
import { Subject } from 'rxjs';
import { PomodoroSettings } from '../../../../shared/types';
import { getInitialPomodoroSettings } from '../../pomodoro/data';
import { isEmpty } from 'lodash';
import { TaskSettings } from '../../../../shared/types/tasks';

export interface SettingsChangedPayload {
  oldSettings: AppSettings;
  newSettings: AppSettings;
}

export class SettingsService {
  readonly settingsChanged$ = new Subject<SettingsChangedPayload>();

  constructor(
    private readonly autoLaunch: AutoLaunch,
    private readonly store: ElectronStore<AppStore>
  ) {
    if (isEmpty(this.pomodoroSettings)) {
      this.pomodoroSettings = getInitialPomodoroSettings();
    }
  }

  async setSettings(settings: AppSettings) {
    try {
      const oldSettings = await this.getSettings();

      const { autoStart, pomodoroSettings, taskSettings } = settings;

      const isAutoStart = await this.autoLaunch.isEnabled();

      if (autoStart && !isAutoStart) {
        await this.autoLaunch.enable();
      } else if (isAutoStart) {
        await this.autoLaunch.disable();
      }

      this.pomodoroSettings = pomodoroSettings;
      this.taskSettings = taskSettings;

      this.settingsChanged$.next({
        oldSettings,
        newSettings: await this.getSettings(),
      });

      return true;
    } catch (e) {
      console.error(`Set settings error: ${e}`);

      throw e;
    }
  }

  get pomodoroSettings() {
    return this.store.get('pomodoroSettings');
  }

  set pomodoroSettings(settings: PomodoroSettings | undefined) {
    this.store.set('pomodoroSettings', settings);
  }

  get taskSettings() {
    return this.store.get('taskSettings');
  }

  set taskSettings(settings: TaskSettings | undefined) {
    this.store.set('taskSettings', settings);
  }

  async getSettings(): Promise<AppSettings> {
    return {
      autoStart: await this.autoLaunch.isEnabled(),
      pomodoroSettings: this.pomodoroSettings!,
      trello: this.store.get('trello'),
      taskSettings: this.taskSettings,
    };
  }

  async getSetting(key: keyof AppSettings) {
    const settings = await this.getSettings();

    return settings[key];
  }
}
