import { PomodoroService } from '../../pomodoro/services/PomodoroService';
import { AppSettings } from '../../../../shared/types/settings';
import AutoLaunch from 'auto-launch';
import { PomodoroState } from '../../../../shared/types';

export class SettingsService {
  constructor(
    private readonly pomodoro: PomodoroService,
    private readonly autoLaunch: AutoLaunch
  ) {}

  async setSettings(settings: AppSettings) {
    const {
      autoStart,
      workDurationSeconds,
      longBreakDurationSeconds,
      shortBreakDurationSeconds,
      ...pomodoroPayload
    } = settings;

    const isAutoStart = await this.autoLaunch.isEnabled();

    if (autoStart && !isAutoStart) {
      await this.autoLaunch.enable();
    } else if (isAutoStart) {
      await this.autoLaunch.disable();
    }

    this.pomodoro.fill(pomodoroPayload);

    this.pomodoro.setDuration(workDurationSeconds, PomodoroState.Work);
    this.pomodoro.setDuration(shortBreakDurationSeconds, PomodoroState.Break);
    this.pomodoro.setDuration(
      longBreakDurationSeconds,
      PomodoroState.LongBreak
    );

    return true;
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
    };
  }
}
