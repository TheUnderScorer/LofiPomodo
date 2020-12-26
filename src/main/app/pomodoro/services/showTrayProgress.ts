import { AppContext } from '../../../context';
import { getDurationByState } from '../logic/nextState';

export const showTrayProgress = ({ windowFactory, pomodoro }: AppContext) => {
  if (process.platform !== 'win32') {
    return;
  }

  pomodoro.subscribe(() => {
    const { timerWindow } = windowFactory;

    if (timerWindow) {
      const duration = getDurationByState(pomodoro);
      const percentage = pomodoro.remainingSeconds / duration;

      timerWindow.setProgressBar(1 - percentage);
    }
  });
};
