import { AppContext } from '../../../context';
import { BrowserWindow } from 'electron';
import { PomodoroServiceEvents } from '../services/PomodoroService';

export const breakWindow = ({ pomodoro, windowFactory }: AppContext) => {
  let breakWindow: BrowserWindow | null = null;

  const breaks = [
    PomodoroServiceEvents.BreakStarted,
    PomodoroServiceEvents.LongBreakStarted,
  ];

  pomodoro.events.onAny(async (eventName) => {
    if (!pomodoro.openFullWindowOnBreak) {
      return;
    }

    if (!breaks.includes(eventName)) {
      if (eventName === PomodoroServiceEvents.WorkStarted && breakWindow) {
        breakWindow.close();
        breakWindow = null;
      }

      return;
    }

    breakWindow = await windowFactory.createBreakWindow();
  });
};
