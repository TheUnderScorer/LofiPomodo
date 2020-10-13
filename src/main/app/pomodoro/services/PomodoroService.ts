import { Changable, Pomodoro, PomodoroState } from '../../../../shared/types';
import { getInitialPomodoro } from '../data';
import ElectronStore from 'electron-store';
import { AppStore } from '../../../../shared/types/store';
import { getDurationByState, getNextState } from '../logic/nextState';
import { secondsToTime } from '../../../../shared/utils/time';

export class PomodoroService implements Changable, Pomodoro {
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

  constructor(private readonly store: ElectronStore<AppStore>) {
    Object.assign(this, getInitialPomodoro());
  }

  onChange() {
    this.store.set('pomodoroState', this.state);

    this.schedule();
  }

  get remainingTime() {
    return secondsToTime(this.remainingSeconds).toString();
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
}
