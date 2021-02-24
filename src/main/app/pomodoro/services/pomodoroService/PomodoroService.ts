import {
  Changable,
  ChangeSubject,
  PomodoroState,
  PomodoroStateChanged,
  PomodoroStates,
  Trigger,
} from '../../../../../shared/types';
import { getInitialPomodoro } from '../../data';
import ElectronStore from 'electron-store';
import { AppStore } from '../../../../../shared/types/store';
import { getDurationByState, getNextState } from '../../logic/nextState';
import { secondsToTime } from '../../../../../shared/utils/time';
import { Reactive } from '../../../../../shared/reactive';
import { percent } from '../../../../../shared/utils/math';
import { shouldRun } from '../../logic/autorun';
import { stateDurationMap } from '../../maps';
import { Jsonable } from '../../../../../shared/types/json';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  SettingsChangedPayload,
  SettingsService,
} from '../../../settings/services/SettingsService';

@Reactive()
export class PomodoroService
  implements
    Changable,
    PomodoroState,
    ChangeSubject<PomodoroService>,
    ChangeSubject<PomodoroService>,
    Jsonable {
  isRunning!: boolean;
  remainingSeconds!: number;
  shortBreakCount!: number;
  start!: Date;
  state!: PomodoroStates;

  timeoutId: any = null;

  changed$!: Subject<PomodoroService>;

  readonly stateChanged$ = new Subject<PomodoroStateChanged>();
  readonly anyBreakStarted$ = this.stateChanged$.pipe(
    filter((payload) => payload.newState !== PomodoroStates.Work)
  );
  readonly shortBreakStarted$ = this.stateChanged$.pipe(
    filter((payload) => payload.newState === PomodoroStates.Break)
  );
  readonly longBreakStarted$ = this.stateChanged$.pipe(
    filter((payload) => payload.newState === PomodoroStates.LongBreak)
  );
  readonly workStarted$ = this.stateChanged$.pipe(
    filter((payload) => payload.newState === PomodoroStates.Work)
  );

  readonly timerTick$ = new Subject<this>();

  readonly timerStop$ = new Subject<this>();

  constructor(
    private readonly store: ElectronStore<AppStore>,
    private readonly settingsService: SettingsService
  ) {
    this.settingsService.settingsChanged$.subscribe((payload) =>
      this.handleSettingsChange(payload)
    );

    const state = store.get('pomodoroState');

    this.fill(state ?? getInitialPomodoro());
    this.schedule();
  }

  private handleSettingsChange({
    newSettings,
    oldSettings,
  }: SettingsChangedPayload) {
    const durationKey = stateDurationMap[this.state];

    const oldSettingsValue = oldSettings.pomodoroSettings![durationKey];

    if (oldSettingsValue === this.remainingSeconds) {
      this.remainingSeconds = newSettings.pomodoroSettings![
        durationKey
      ] as number;

      this.onChange();
      this.changed$.next(this);
    }
  }

  fill(pomodoro: Partial<PomodoroState>) {
    const { remainingTime, remainingPercentage, ...payload } = pomodoro;
    Object.assign(this, payload);
  }

  onChange() {
    this.store.set('pomodoroState', this.toJSON());

    this.schedule();
  }

  get remainingTime(): string {
    return secondsToTime(this.remainingSeconds).toClockString();
  }

  get remainingPercentage(): number {
    const duration = getDurationByState(
      this.settingsService.pomodoroSettings!,
      this.state
    );

    return percent(this.remainingSeconds, duration);
  }

  stop() {
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
      if (!this.isRunning) {
        this.stop();
      }

      return;
    }

    this.timeoutId = setTimeout(async () => {
      this.timeoutId = null;

      if (!this.isRunning) {
        return;
      }

      let newRemainingSeconds = this.remainingSeconds - 1;

      if (newRemainingSeconds <= 0) {
        await this.moveToNextState();
      } else {
        this.timerTick$.next(this);

        this.fill({
          remainingSeconds: newRemainingSeconds,
        });
      }

      this.onChange();
    }, 1000);
  }

  addSeconds(seconds: number) {
    this.remainingSeconds += seconds;
  }

  async moveToNextState(
    trigger: Trigger = Trigger.Scheduled,
    nextState?: PomodoroStates
  ) {
    const oldState = this.state;

    const newStart = new Date();
    const pomodoroSettings = this.settingsService.pomodoroSettings!;

    const newPomodoroState = nextState ?? getNextState(this, pomodoroSettings);
    const newRemainingSeconds = getDurationByState(
      pomodoroSettings,
      newPomodoroState
    );
    const newIsRunning = shouldRun(this.state, pomodoroSettings);

    let newBreakCount =
      this.state === PomodoroStates.Break
        ? this.shortBreakCount + 1
        : this.shortBreakCount;

    if (this.state === PomodoroStates.LongBreak) {
      newBreakCount = 0;
    }

    this.fill({
      remainingSeconds: newRemainingSeconds,
      state: newPomodoroState,
      isRunning: newIsRunning,
      shortBreakCount: newBreakCount,
      start: newStart,
    });

    this.stateChanged$.next({
      newState: newPomodoroState,
      oldState,
      pomodoro: this,
      trigger,
    });
  }

  resetCurrentState() {
    const key = stateDurationMap[this.state];

    this.remainingSeconds = this.settingsService.pomodoroSettings![
      key
    ] as number;
  }

  async skipBreak() {
    if (this.state === PomodoroStates.Work) {
      return;
    }

    await this.moveToNextState();
  }

  toJSON(): PomodoroState {
    return {
      isRunning: this.isRunning,
      remainingSeconds: this.remainingSeconds,
      remainingTime: this.remainingTime,
      shortBreakCount: this.shortBreakCount,
      start: this.start,
      state: this.state,
      remainingPercentage: this.remainingPercentage,
    };
  }

  async restart() {
    await this.moveToNextState(Trigger.Manual, PomodoroStates.Work);

    this.shortBreakCount = 0;
    this.isRunning = false;
  }

  toggle() {
    this.isRunning = !this.isRunning;
  }
}
