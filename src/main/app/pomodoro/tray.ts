import { AppContext } from '../../context';
import { nativeImage, Tray } from 'electron';
import { PomodoroService } from './services/pomodoroService/PomodoroService';
import { pomodoroStateDictionary } from '../../../shared/dictionary/pomodoro';

export const setupTray = (context: AppContext) => {
  const img = nativeImage.createEmpty();

  const tray = new Tray(img);

  tray.on('right-click', () => {
    context.pomodoro.isRunning = !context.pomodoro.isRunning;
  });

  tray.on('click', async () => {
    await context.windowFactory
      .createTimerWindow()
      .then((window) => window.focus());
  });

  const setTitle = (pomodoro: Readonly<PomodoroService>) => {
    tray.setTitle(
      `${pomodoroStateDictionary[context.pomodoro.state].toUpperCase()}: ${
        pomodoro.remainingTime
      }`
    );
  };

  setTitle(context.pomodoro);

  context.pomodoro.subscribe((state) => {
    setTitle(state);
  });
};
