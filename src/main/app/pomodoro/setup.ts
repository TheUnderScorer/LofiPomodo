import { AppContext } from '../../context';
import { Pomodoro, PomodoroOperations, Trigger } from '../../../shared/types';
import { setupTray } from './tray';
import { breakWindow } from './services/breakWindow';
import { sendUpdatesToWindows } from './services/rendererUpdates';
import { showTrayProgress } from './services/showTrayProgress';
import { restartPomodoroOnNewDay } from './services/restartPomodoroOnNewDay';

export const setupPomodoro = (context: AppContext) => {
  sendUpdatesToWindows(context);
  breakWindow(context);
  setupTray(context);
  showTrayProgress(context);
  restartPomodoroOnNewDay(context.pomodoroService).catch(console.error);

  context.ipcService.registerAsMap({
    [PomodoroOperations.UpdatePomodoro]: (_, payload: Pomodoro) => {
      if (!payload) {
        return;
      }

      context.pomodoroService.fill(payload);
    },
    [PomodoroOperations.GetPomodoroState]: () =>
      context.pomodoroService.toJSON(),
    [PomodoroOperations.RestartCurrentState]: () =>
      context.pomodoroService.resetCurrentState(),
    [PomodoroOperations.MoveToNextState]: () =>
      context.pomodoroService.moveToNextState(Trigger.Manual),
  });
};
