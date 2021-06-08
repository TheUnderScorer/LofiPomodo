import { PomodoroState, PomodoroStates } from '../../../../../shared/types';
import ElectronStore from 'electron-store';
import { AppStore } from '../../../../../shared/types/store';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SettingsService } from '../../../settings/services/SettingsService';
import { PomodoroStateManager } from './PomodoroStateManager';

export class PomodoroService {
  wasRunning?: boolean;

  timeoutId: any = null;

  state: PomodoroStateManager;

  readonly timerTick$ = new Subject<this>();

  readonly timerStop$ = new Subject<this>();

  readonly timerStart$ = new Subject<PomodoroService>();

  readonly workTimerStart$ = this.timerStart$.pipe(
    filter((payload) => payload.state.state === PomodoroStates.Work)
  );

  readonly anyBreakTimerStart$ = this.timerStart$.pipe(
    filter((payload) => payload.state.state !== PomodoroStates.Work)
  );

  constructor(
    private readonly store: ElectronStore<AppStore>,
    private readonly settingsService: SettingsService
  ) {
    this.state = new PomodoroStateManager(this.store, this.settingsService);

    this.state.changed$.subscribe(() => this.schedule());

    this.schedule();
  }

  fill(pomodoro: Partial<PomodoroState>) {
    this.state.fill(pomodoro);
  }

  stop() {
    this.wasRunning = false;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;

      this.timerStop$.next(this);

      return true;
    }

    return false;
  }

  private schedule() {
    if (this.timeoutId) {
      if (!this.state.isRunning) {
        this.stop();
      }

      return;
    }

    this.handleTimerStart();

    this.timeoutId = setTimeout(async () => {
      this.timeoutId = null;

      if (!this.state.isRunning) {
        return;
      }

      let newRemainingSeconds = this.state.remainingSeconds - 1;

      if (newRemainingSeconds <= 0) {
        await this.state.moveToNextState();
      } else {
        this.timerTick$.next(this);

        this.fill({
          remainingSeconds: newRemainingSeconds,
        });
      }

      this.schedule();
    }, 1000);
  }

  private handleTimerStart() {
    if (this.state.isRunning && !this.wasRunning) {
      this.wasRunning = true;

      this.timerStart$.next(this);
    }
  }
}
