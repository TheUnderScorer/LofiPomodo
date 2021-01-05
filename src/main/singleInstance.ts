import { app } from 'electron';

export const setupSingleInstance = () => {
  const instanceLock = app.requestSingleInstanceLock();

  if (!instanceLock) {
    app.quit();

    return;
  }
}