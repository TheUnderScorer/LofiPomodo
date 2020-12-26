import { AppContext } from '../../context';
import { Pomodoro, PomodoroEvents } from '../../../shared/types';
import { setupTray } from './tray';
import { breakWindow } from './services/breakWindow';
import { sendUpdatesToWindows } from './services/rendererUpdates';
import { handleTimerMenu } from './services/timerMenu';
import { BrowserWindow } from 'electron';
import { showTrayProgress } from './services/showTrayProgress';
import { Trigger } from './services/pomodoroService/PomodoroService';
import { restartPomodoroOnNewDay } from './services/restartPomodoroOnNewDay';

export const setupPomodoro = (context: AppContext) => {
  sendUpdatesToWindows(context);
  breakWindow(context);
  setupTray(context);
  forwardPomodoroEventsToIpc(context);
  showTrayProgress(context);
  restartPomodoroOnNewDay(context.pomodoro).catch(console.error);

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
