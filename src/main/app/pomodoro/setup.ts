import { AppContext } from '../../context';
import { Pomodoro, PomodoroEvents } from '../../../shared/types';
import { setupTray } from './tray';
import { breakWindow } from './features/breakWindow';
import { sendUpdatesToWindows } from './features/rendererUpdates';
import { handleTimerMenu } from './features/timerMenu';
import { BrowserWindow } from 'electron';

export const setupPomodoro = (context: AppContext) => {
  sendUpdatesToWindows(context);
  breakWindow(context);
  setupTray(context);
  forwardPomodoroEventsToIpc(context);

  context.ipcService.registerAsMap({
    [PomodoroEvents.Update]: (_, payload: Pomodoro) => {
      if (!payload) {
        return;
      }

      context.pomodoro.fill(payload);
    },
    [PomodoroEvents.GetState]: () => context.pomodoro.toJSON(),
    [PomodoroEvents.ToggleTimerMenu]: handleTimerMenu(context),
  });
};

const forwardPomodoroEventsToIpc = (context: AppContext) => {
  context.pomodoro.events.onAny((eventName) => {
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send(eventName, context.pomodoro.toJSON());
    });
  });
};
