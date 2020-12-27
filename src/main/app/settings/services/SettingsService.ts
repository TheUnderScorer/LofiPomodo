import { PomodoroService } from '../../pomodoro/services/pomodoroService/PomodoroService';
import { AppSettings } from '../../../../shared/types/settings';
import AutoLaunch from 'auto-launch';
import { PomodoroState } from '../../../../shared/types';
import { AppStore } from '../../../../shared/types/store';
import ElectronStore from 'electron-store';

export class SettingsService {
  constructor(
    private readonly pomodoro: PomodoroService,
    private readonly autoLaunch: AutoLaunch,
    private readonly store: ElectronStore<AppStore>
  ) {}

  async setSettings(settings: AppSettings) {
    const { autoStart, trello, ...pomodoroPayload } = settings;

    const isAutoStart = await this.autoLaunch.isEnabled();

    if (autoStart && !isAutoStart) {
      await this.autoLaunch.enable();
    } else if (isAutoStart) {
      await this.autoLaunch.disable();
    }

    this.updatePomodoroSettings(pomodoroPayload);

    this.store.set('trello', trello);

    return true;
  }

  private updatePomodoroSettings({
    workDurationSeconds,
    shortBreakDurationSeconds,
    longBreakDurationSeconds,
    ...pomodoroPayload
  }: Pick<
    AppSettings,
    | 'longBreakInterval'
    | 'autoRunBreak'
    | 'autoRunWork'
    | 'openFullWindowOnBreak'
    | 'workDurationSeconds'
    | 'shortBreakDurationSeconds'
    | 'longBreakDurationSeconds'
  >) {
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
      shortBreakDurationSeconds: this.pomodoro.shortBreakDurationSeconds,
      longBreakDurationSeconds: this.pomodoro.longBreakDurationSeconds,
      workDurationSeconds: this.pomodoro.workDurationSeconds,
      autoRunBreak: this.pomodoro.autoRunBreak,
      openFullWindowOnBreak: this.pomodoro.openFullWindowOnBreak,
      longBreakInterval: this.pomodoro.longBreakInterval,
      autoRunWork: this.pomodoro.autoRunWork,
      trello: this.store.get('trello'),
    };
  }

  async getSetting(key: keyof AppSettings) {
    const settings = await this.getSettings();

    return settings[key];
  }
}
