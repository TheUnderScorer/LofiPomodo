import { AppContext } from '../../../context';
import {
  PomodoroService,
  PomodoroServiceEvents,
  Trigger,
} from '../services/PomodoroService';

export const breakWindow = ({ pomodoro, windowFactory }: AppContext) => {
  pomodoro.events.onAny(async (eventName, payload) => {
    if (!pomodoro.openFullWindowOnBreak) {
      return;
    }

    if (!PomodoroService.breakEventsMap.includes(eventName)) {
      if (
        eventName === PomodoroServiceEvents.WorkStarted &&
        windowFactory.breakWindow
      ) {
        await windowFactory.breakWindow.close();
      }

      return;
    }

    if (payload?.trigger === Trigger.Scheduled) {
      await windowFactory.createBreakWindow();
    }
  });
};
