import { BrowserWindow } from 'electron';
import { setupWindow } from './setup';
import { routes } from '../../../../shared/routes/routes';

export class WindowFactory {
  constructor(private readonly preloadPath: string) {}

  async createTimerWindow() {
    const window = new BrowserWindow({
      height: 500,
      width: 500,
      fullscreenable: false,
      maximizable: false,
      simpleFullscreen: false,
      fullscreen: false,
      minimizable: false,
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

  async createBreakWindow() {
    const window = new BrowserWindow({
      height: 600,
      width: 600,
      fullscreenable: true,
      fullscreen: true,
      minimizable: false,
      maximizable: false,
      title: 'Break',
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        preload: this.preloadPath,
        nodeIntegration: false,
      },
    });

    await setupWindow(window, routes.timer(true));

    return window;
  }
}
