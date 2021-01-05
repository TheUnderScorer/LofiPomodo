import { PomodoroService } from '../../pomodoro/services/pomodoroService/PomodoroService';
import { AppSettings } from '../../../../shared/types/settings';
import AutoLaunch from 'auto-launch';
import { PomodoroSettings, PomodoroState } from '../../../../shared/types';
import { AppStore } from '../../../../shared/types/store';
import ElectronStore from 'electron-store';

export class SettingsService {
  constructor(
    private readonly pomodoro: PomodoroService,
    private readonly autoLaunch: AutoLaunch,
    private readonly store: ElectronStore<AppStore>
  ) {}

  async setSettings(settings: AppSettings) {
    try {
      const { autoStart, pomodoro } = settings;

      const isAutoStart = await this.autoLaunch.isEnabled();

      if (autoStart && !isAutoStart) {
        await this.autoLaunch.enable();
      } else if (isAutoStart) {
        await this.autoLaunch.disable();
      }

      this.updatePomodoroSettings(pomodoro);

      return true;
    } catch (e) {
      console.error(`Set settings error: ${e}`);

      throw e;
    }
  }

  private updatePomodoroSettings({
    workDurationSeconds,
    shortBreakDurationSeconds,
    longBreakDurationSeconds,
    ...pomodoroPayload
  }: PomodoroSettings) {
    this.pomodoro.fill(pomodoroPayload);

    this.pomodoro.setDuration(workDurationSeconds, PomodoroState.Work);
    this.pomodoro.setDuration(shortBreakDurationSeconds, PomodoroState.Break);
    this.pomodoro.setDuration(
      longBreakDurationSeconds,
      PomodoroState.LongBreak
    );
  }

  async getSettings(): Promise<AppSettings> {
    return {
      autoStart: await this.autoLaunch.isEnabled(),
      pomodoro: this.pomodoro.toJSON(),
      trello: this.store.get('trello'),
    };
  }

  async getSetting(key: keyof AppSettings) {
    const settings = await this.getSettings();

    return settings[key];
  }
}
