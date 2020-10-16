import { AppContext } from '../../context';
import { BrowserWindow } from 'electron';
import { Pomodoro, PomodoroEvents } from '../../../shared/types';
import { PomodoroServiceEvents } from './services/PomodoroService';
import { setupTray } from './tray';

export const setupPomodoro = (context: AppContext) => {
  sendUpdatesToWindows(context);
  breakWindow(context);
  setupTray(context);

  context.ipcService.handle(
    PomodoroEvents.Update,
    (event, payload: Pomodoro) => {
      if (!payload) {
        return;
      }

      context.pomodoro.fill(payload);
    }
  );

  context.ipcService.handle(PomodoroEvents.GetState, () => {
    return context.pomodoro.toJSON();
  });
};

const sendUpdatesToWindows = ({ pomodoro }: AppContext) => {
  pomodoro.subscribe((data) => {
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send(PomodoroEvents.Updated, data.toJSON());
    });
  });
};

const breakWindow = ({ pomodoro, windowFactory }: AppContext) => {
  let breakWindow: BrowserWindow | null = null;

  const breaks = [
    PomodoroServiceEvents.BreakStarted,
    PomodoroServiceEvents.LongBreakStarted,
  ];

  pomodoro.events.onAny(async (eventName) => {
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
