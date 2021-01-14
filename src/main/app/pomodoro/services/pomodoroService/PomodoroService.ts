import {
  CanSubscribe,
  Changable,
  Pomodoro,
  PomodoroState,
  Subscriber,
} from '../../../../../shared/types';
import { getInitialPomodoro } from '../../data';
import ElectronStore from 'electron-store';
import { AppStore } from '../../../../../shared/types/store';
import { getDurationByState, getNextState } from '../../logic/nextState';
import { secondsToTime } from '../../../../../shared/utils/time';
import { Reactive } from '../../../../../shared/reactive';
import { percent } from '../../../../../shared/utils/math';
import { Typed as TypedEmittery } from 'emittery';
import { shouldRun } from '../../logic/autorun';
import { stateDurationMap } from '../../maps';
import { Jsonable } from '../../../../../shared/types/json';

export enum Trigger {
  Manual = 'Manual',
  Scheduled = 'Scheduled',
}

export enum PomodoroServiceEvents {
  BreakStarted = 'PomodoroBreakStarted',
  WorkStarted = 'PomodoroWorkStarted',
  LongBreakStarted = 'PomodoroLongBreakStarted',
}

export interface PomodoroStateChangedPayload {
  pomodoro: PomodoroService;
  trigger: Trigger;
}

export interface PomodoroServiceEventsMap {
  [PomodoroServiceEvents.BreakStarted]: PomodoroStateChangedPayload;
  [PomodoroServiceEvents.LongBreakStarted]: PomodoroStateChangedPayload;
  [PomodoroServiceEvents.WorkStarted]: PomodoroStateChangedPayload;
}

@Reactive()
export class PomodoroService
  implements Changable, Pomodoro, CanSubscribe<PomodoroService>, Jsonable {
  isRunning!: boolean;
  longBreakDurationSeconds!: number;
  longBreakInterval!: number;
  remainingSeconds!: number;
  shortBreakCount!: number;
  shortBreakDurationSeconds!: number;
  start!: Date;
  state!: PomodoroState;
  workDurationSeconds!: number;
  openFullWindowOnBreak!: boolean;
  autoRunBreak!: boolean;
  autoRunWork!: boolean;

  timeoutId: any = null;

  subscribe!: Subscriber<PomodoroService>;

  events = new TypedEmittery<PomodoroServiceEventsMap>();

  public static readonly breakEventsMap = [
    PomodoroServiceEvents.LongBreakStarted,
    PomodoroServiceEvents.BreakStarted,
  ];

  private static newStateEventMap = {
    [PomodoroState.Work]: PomodoroServiceEvents.WorkStarted,
    [PomodoroState.LongBreak]: PomodoroServiceEvents.LongBreakStarted,
    [PomodoroState.Break]: PomodoroServiceEvents.BreakStarted,
  };

  constructor(private readonly store: ElectronStore<AppStore>) {
    const storeValue = store.get('pomodoroState');

    this.fill(storeValue ?? getInitialPomodoro());
    this.schedule();
  }

  fill(pomodoro: Partial<Pomodoro>) {
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
    const duration = getDurationByState(this);

    return percent(this.remainingSeconds, duration);
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;

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
        this.fill({
          remainingSeconds: newRemainingSeconds,
        });
      }

      this.onChange();
    }, 1000);
  }

  async moveToNextState(
    trigger: Trigger = Trigger.Scheduled,
    nextState?: PomodoroState
  ) {
    const newStart = new Date();
    const newPomodoroState = nextState ?? getNextState(this);
    const newRemainingSeconds = getDurationByState(this, newPomodoroState);
    const newIsRunning = shouldRun({
      ...this,
      state: newPomodoroState,
    });

    let newBreakCount =
      this.state === PomodoroState.Break
        ? this.shortBreakCount + 1
        : this.shortBreakCount;

    if (this.state === PomodoroState.LongBreak) {
      newBreakCount = 0;
    }

    this.fill({
      remainingSeconds: newRemainingSeconds,
      state: newPomodoroState,
      isRunning: newIsRunning,
      shortBreakCount: newBreakCount,
      start: newStart,
    });

    const eventToEmit = PomodoroService.newStateEventMap[newPomodoroState];

    await this.events.emit(eventToEmit, {
      pomodoro: this,
      trigger,
    });
  }

  setDuration(
    seconds: number,
    target: PomodoroState,
    forceSet: boolean = false
  ) {
    const key = stateDurationMap[target];

    const prevSeconds = this[key] as number;

    this.fill({
      [key]: seconds,
      remainingSeconds:
        this.state === target &&
        (this.remainingSeconds === prevSeconds || forceSet)
          ? seconds
          : this.remainingSeconds,
    });
  }

  resetCurrentState() {
    const key = stateDurationMap[this.state];

    this.remainingSeconds = this[key] as number;
  }

  async skipBreak() {
    if (this.state === PomodoroState.Work) {
      return;
    }

    await this.moveToNextState();
  }

  toJSON(): Pomodoro {
    return {
      autoRunWork: this.autoRunWork,
      autoRunBreak: this.autoRunBreak,
      isRunning: this.isRunning,
      longBreakDurationSeconds: this.longBreakDurationSeconds,
      longBreakInterval: this.longBreakInterval,
      remainingSeconds: this.remainingSeconds,
      remainingTime: this.remainingTime,
      shortBreakCount: this.shortBreakCount,
      shortBreakDurationSeconds: this.shortBreakDurationSeconds,
      start: this.start,
      state: this.state,
      workDurationSeconds: this.workDurationSeconds,
      remainingPercentage: this.remainingPercentage,
      openFullWindowOnBreak: this.openFullWindowOnBreak,
    };
  }

  async restart() {
    await this.moveToNextState(Trigger.Manual, PomodoroState.Work);

    this.shortBreakCount = 0;
    this.isRunning = false;
  }

  toggle() {
    this.isRunning = !this.isRunning;
  }
}
