import { AppContext } from '../../context';
import { Pomodoro, PomodoroEvents } from '../../../shared/types';
import { setupTray } from './tray';
import { breakWindow } from './features/breakWindow';
import { sendUpdatesToWindows } from './features/rendererUpdates';
import { handleTimerMenu } from './features/timerMenu';
import { BrowserWindow } from 'electron';
import { showTrayProgress } from './features/showTrayProgress';
import { Trigger } from './services/PomodoroService';

export const setupPomodoro = (context: AppContext) => {
  sendUpdatesToWindows(context);
  breakWindow(context);
  setupTray(context);
  forwardPomodoroEventsToIpc(context);
  showTrayProgress(context);

  context.ipcService.registerAsMap({
    [PomodoroEvents.Update]: (_, payload: Pomodoro) => {
      if (!payload) {
        return;
      }

      context.pomodoro.fill(payload);
    },
    [PomodoroEvents.GetState]: () => context.pomodoro.toJSON(),
    [PomodoroEvents.ToggleTimerMenu]: handleTimerMenu(context),
    [PomodoroEvents.RestartCurrentState]: () =>
      context.pomodoro.resetCurrentState(),
    [PomodoroEvents.MoveToNextState]: () =>
      context.pomodoro.moveToNextState(Trigger.Manual),
  });
};

const forwardPomodoroEventsToIpc = (context: AppContext) => {
  context.pomodoro.events.onAny((eventName) => {
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send(eventName, context.pomodoro.toJSON());
    });
  });
};
