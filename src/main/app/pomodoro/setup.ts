import { AppContext } from '../../context';
import { Pomodoro, PomodoroOperations, Trigger } from '../../../shared/types';
import { setupTray } from './tray';
import { breakWindow } from './services/breakWindow';
import { sendUpdatesToWindows } from './services/rendererUpdates';
import { handleTimerMenu } from './services/timerMenu';
import { showTrayProgress } from './services/showTrayProgress';
import { restartPomodoroOnNewDay } from './services/restartPomodoroOnNewDay';

export const setupPomodoro = (context: AppContext) => {
  sendUpdatesToWindows(context);
  breakWindow(context);
  setupTray(context);
  showTrayProgress(context);
  restartPomodoroOnNewDay(context.pomodoro).catch(console.error);

  context.ipcService.registerAsMap({
    [PomodoroOperations.Update]: (_, payload: Pomodoro) => {
      if (!payload) {
        return;
      }

      context.pomodoro.fill(payload);
    },
    [PomodoroOperations.GetState]: () => context.pomodoro.toJSON(),
    [PomodoroOperations.ToggleTimerMenu]: handleTimerMenu(context),
    [PomodoroOperations.RestartCurrentState]: () =>
      context.pomodoro.resetCurrentState(),
    [PomodoroOperations.MoveToNextState]: () =>
      context.pomodoro.moveToNextState(Trigger.Manual),
  });
};
