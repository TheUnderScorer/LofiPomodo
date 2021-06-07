import {
  Changable,
  ChangeSubject,
  PomodoroState,
  PomodoroStateChanged,
  PomodoroStates,
  Trigger,
} from '../../../../../shared/types';
import { Jsonable } from '../../../../../shared/types/json';
import { Reactive } from '../../../../../shared/reactive';
import { Subject } from 'rxjs';
import { secondsToTime } from '../../../../../shared/utils/time';
import { getDurationByState, getNextState } from '../../logic/nextState';
import { percent } from '../../../../../shared/utils/math';
import ElectronStore from 'electron-store';
import { AppStore } from '../../../../../shared/types/store';
import {
  SettingsChangedPayload,
  SettingsService,
} from '../../../settings/services/SettingsService';
import { getInitialPomodoroState } from '../../data';
import { stateDurationMap } from '../../maps';
import { shouldRun } from '../../logic/autorun';
import { filter } from 'rxjs/operators';

@Reactive()
export class PomodoroStateManager
  implements
    PomodoroState,
    Changable,
    ChangeSubject<PomodoroStateManager>,
    Jsonable
{
  isRunning!: boolean;

  wasRunning?: boolean;

  remainingSeconds!: number;

  shortBreakCount!: number;

  start!: Date;

  state!: PomodoroStates;

  changed$!: Subject<PomodoroStateManager>;

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

  constructor(
    private readonly store: ElectronStore<AppStore>,
    private readonly settingsService: SettingsService
  ) {
    this.settingsService.settingsChanged$.subscribe((payload) =>
      this.handleSettingsChange(payload)
    );

    const state = store.get('pomodoroState');

    this.fill(state ?? getInitialPomodoroState());
  }

  onChange() {
    this.store.set('pomodoroState', this.toJSON());
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
      trigger,
    });
  }

  resetCurrentState() {
    const key = stateDurationMap[this.state];

    this.remainingSeconds = this.settingsService.pomodoroSettings![
      key
    ] as number;
  }

  async restart() {
    await this.moveToNextState(Trigger.Manual, PomodoroStates.Work);

    this.shortBreakCount = 0;
    this.isRunning = false;
  }

  toggle() {
    this.isRunning = !this.isRunning;
  }

  async skipBreak() {
    if (this.state === PomodoroStates.Work) {
      return;
    }

    await this.moveToNextState();
  }

  addSeconds(seconds: number) {
    this.remainingSeconds += seconds;
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
      wasRunning: this.wasRunning,
    };
  }
}
