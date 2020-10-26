import { Pomodoro, PomodoroState } from '../../../../shared/types';

export const shouldRun = (pomodoro: Pomodoro) => {
  if (pomodoro.state === PomodoroState.Work) {
    return pomodoro.autoRunWork;
  }

  return pomodoro.autoRunBreak;
};
