import { AppContext } from '../../context';
import { nativeImage, Tray } from 'electron';
import { PomodoroService } from './services/pomodoroService/PomodoroService';
import { pomodoroStateDictionary } from '../../../shared/dictionary/pomodoro';
import { is } from 'electron-util';

export const setupTray = (context: AppContext) => {
  const img = nativeImage.createEmpty();

  const tray = new Tray(img);

  tray.on('click', async () => {
    await context.windowFactory
      .createTimerWindow()
      .then((window) => window.focus());
  });

  if (!is.windows) {
    const setTitle = (pomodoro: Readonly<PomodoroService>) => {
      tray.setTitle(
        `${pomodoroStateDictionary[context.pomodoro.state].toUpperCase()}: ${
          pomodoro.remainingTime
        }`
      );
    };

    setTitle(context.pomodoro);

    context.pomodoro.changed$.subscribe((state) => {
      setTitle(state);
    });

    tray.on('right-click', () => {
      context.pomodoro.isRunning = !context.pomodoro.isRunning;
    });

    return;
  }

  tray.setContextMenu(context.contextMenuFactory.createTrayContextMenu());
};
