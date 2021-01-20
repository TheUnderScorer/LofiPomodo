import { app } from 'electron';
import { WindowFactory } from './shared/windows/factories/WindowFactory';

export const setupSingleInstance = (windowFactory: WindowFactory) => {
  const instanceLock = app.requestSingleInstanceLock();

  if (!instanceLock) {
    app.quit();

    return;
  }

  app.on('second-instance', async () => {
    await windowFactory.createTimerWindow();
  });
};
