import { AppContext } from '../../context';
import { nativeImage, Tray } from 'electron';
import { pomodoroStateDictionary } from '../../../shared/dictionary/pomodoro';
import { is } from 'electron-util';
import { PomodoroStateManager } from './services/pomodoroService/PomodoroStateManager';

export const setupTray = (context: AppContext) => {
  const img = nativeImage.createEmpty();

  const tray = new Tray(img);

  tray.on('click', async () => {
    await context.windowFactory.createTimerWindow();
  });

  if (!is.windows) {
    const setTitle = (state: Readonly<PomodoroStateManager>) => {
      tray.setTitle(
        `${pomodoroStateDictionary[
          context.pomodoroService.state.state
        ].toUpperCase()}: ${state.remainingTime}`
      );
    };

    setTitle(context.pomodoroService.state);

    context.pomodoroService.state.changed$.subscribe((state) => {
      setTitle(state);
    });

    tray.on('right-click', () => {
      context.pomodoroService.state.toggle();
    });

    return;
  }

  tray.setContextMenu(context.contextMenuFactory.createTrayContextMenu());
};
