import { BrowserWindow } from 'electron';
import { setupWindow } from './setup';
import { routes } from '../../../../shared/routes/routes';

export class WindowFactory {
  constructor(private readonly preloadPath: string) {}

  async createTimerWindow() {
    const window = new BrowserWindow({
      height: 500,
      width: 500,
      title: 'Lofi Pomodoro',
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        preload: this.preloadPath,
        nodeIntegration: false,
      },
    });

    await setupWindow(window, routes.timer());

    return window;
  }
}
