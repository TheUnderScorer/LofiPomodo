import { AppContext } from '../../context';
import {
  PomodoroOperations,
  PomodoroState,
  Trigger,
} from '../../../shared/types';
import { setupTray } from './tray';
import { breakWindow } from './services/breakWindow';
import { sendUpdatesToWindows } from './services/rendererUpdates';
import { showTrayProgress } from './services/showTrayProgress';
import { restartPomodoroOnNewDay } from './services/restartPomodoroOnNewDay';
import { breakSoonNotification } from './services/breakSoonNotification';
import { pomodoroDnd } from './services/pomodoroDnd';

export const setupPomodoro = (context: AppContext) => {
  sendUpdatesToWindows(context);
  breakWindow(context);
  setupTray(context);
  showTrayProgress(context);
  restartPomodoroOnNewDay(context.pomodoroService).catch(console.error);
  breakSoonNotification(context);
  pomodoroDnd(context);

  context.ipcService.registerAsMap({
    [PomodoroOperations.UpdatePomodoro]: (_, payload: PomodoroState) => {
      if (!payload) {
        return;
      }

      context.pomodoroService.fill(payload);
    },
    [PomodoroOperations.GetPomodoroState]: () =>
      context.pomodoroService.state.toJSON(),
    [PomodoroOperations.RestartCurrentState]: () =>
      context.pomodoroService.state.resetCurrentState(),
    [PomodoroOperations.MoveToNextState]: () =>
      context.pomodoroService.state.moveToNextState(Trigger.Manual),
  });
};
