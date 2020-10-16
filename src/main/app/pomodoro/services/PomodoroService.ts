import {
  CanSubscribe,
  Changable,
  Pomodoro,
  PomodoroState,
  Subscriber,
} from '../../../../shared/types';
import { getInitialPomodoro } from '../data';
import ElectronStore from 'electron-store';
import { AppStore } from '../../../../shared/types/store';
import { getDurationByState, getNextState } from '../logic/nextState';
import { secondsToTime } from '../../../../shared/utils/time';
import { Reactive } from '../../../../shared/reactive';
import { percent } from '../../../../shared/utils/math';
import { Typed as TypedEmittery } from 'emittery';

export enum PomodoroServiceEvents {
  BreakStarted = 'BreakStarted',
  WorkStarted = 'WorkStarted',
  LongBreakStarted = 'LongBreakStarted',
}

export interface PomodoroServiceEventsMap {
  [PomodoroServiceEvents.BreakStarted]: PomodoroService;
  [PomodoroServiceEvents.LongBreakStarted]: PomodoroService;
  [PomodoroServiceEvents.WorkStarted]: PomodoroService;
}

@Reactive()
export class PomodoroService
  implements Changable, Pomodoro, CanSubscribe<PomodoroService> {
  autoRun!: boolean;
  isRunning!: boolean;
  longBreakDurationSeconds!: number;
  longBreakInterval!: number;
  remainingSeconds!: number;
  shortBreakCount!: number;
  shortBreakDurationSeconds!: number;
  start!: Date;
  state!: PomodoroState;
  workDurationSeconds!: number;

  timeoutId: any = null;

  subscribe!: Subscriber<PomodoroService>;

  events = new TypedEmittery<PomodoroServiceEventsMap>();

  private static newStateEventMap = {
    [PomodoroState.Work]: PomodoroServiceEvents.WorkStarted,
    [PomodoroState.LongBreak]: PomodoroServiceEvents.LongBreakStarted,
    [PomodoroState.Break]: PomodoroServiceEvents.BreakStarted,
  };

  constructor(private readonly store: ElectronStore<AppStore>) {
    // TODO Fetch pomodoro state from store
    this.fill(getInitialPomodoro());
  }

  fill(pomodoro: Pomodoro) {
    const { remainingTime, remainingPercentage, ...payload } = pomodoro;
    Object.assign(this, payload);
  }

  onChange() {
    this.store.set('pomodoroState', this.state);

    this.schedule();
  }

  get remainingTime(): string {
    return secondsToTime(this.remainingSeconds).toString();
  }

  get remainingPercentage(): number {
    return percent(this.remainingSeconds, getDurationByState(this));
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

    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;

      if (!this.isRunning) {
        return;
      }

      let newPomodoroState = this.state;
      let newRemainingSeconds = this.remainingSeconds - 1;
      let newIsRunning: boolean = this.isRunning;
      let newBreakCount = this.shortBreakCount;

      if (newRemainingSeconds <= 0) {
        newPomodoroState = getNextState(this);
        newRemainingSeconds = getDurationByState(this, newPomodoroState);
        newIsRunning = this.autoRun;
        newBreakCount =
          this.state === PomodoroState.Break
            ? newBreakCount + 1
            : newBreakCount;

        if (this.state === PomodoroState.LongBreak) {
          newBreakCount = 0;
        }

        const eventToEmit = PomodoroService.newStateEventMap[newPomodoroState];

        this.events.emit(eventToEmit, this);
      }

      Object.assign(this, {
        remainingSeconds: newRemainingSeconds,
        state: newPomodoroState,
        isRunning: newIsRunning,
        shortBreakCount: newBreakCount,
      });

      this.onChange();
    }, 1000);
  }

  toJSON(): Pomodoro {
    return {
      autoRun: this.autoRun,
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
    };
  }
}
