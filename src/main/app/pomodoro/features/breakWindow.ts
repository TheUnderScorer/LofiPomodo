import { AppContext } from '../../../context';
import { BrowserWindow } from 'electron';
import {
  PomodoroService,
  PomodoroServiceEvents,
} from '../services/PomodoroService';

export const breakWindow = ({ pomodoro, windowFactory }: AppContext) => {
  let breakWindow: BrowserWindow | null = null;

  pomodoro.events.onAny(async (eventName) => {
    if (!pomodoro.openFullWindowOnBreak) {
      return;
    }

    if (!PomodoroService.breakEventsMap.includes(eventName)) {
      if (eventName === PomodoroServiceEvents.WorkStarted && breakWindow) {
        breakWindow.close();
        breakWindow = null;
      }

      return;
    }

    breakWindow = await windowFactory.createBreakWindow();
  });
};
