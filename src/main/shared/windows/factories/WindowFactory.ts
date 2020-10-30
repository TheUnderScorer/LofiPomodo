import { BrowserWindow } from 'electron';
import { setupWindow } from './setup';
import { routes } from '../../../../shared/routes/routes';
import { getWindowByTitle } from '../getWindowByTitle';

export enum WindowTitles {
  Timer = 'Lofi Pomodoro',
  Break = 'Break',
}

export class WindowFactory {
  private static windowMap: Record<
    WindowTitles,
    keyof Pick<WindowFactory, 'createBreakWindow' | 'createTimerWindow'>
  > = {
    [WindowTitles.Timer]: 'createTimerWindow',
    [WindowTitles.Break]: 'createBreakWindow',
  };

  constructor(private readonly preloadPath: string) {}

  async getOrCreateWindow(title: WindowTitles) {
    const foundWindow = getWindowByTitle(title);

    if (foundWindow) {
      return foundWindow;
    }

    const method = WindowFactory.windowMap[title];

    return this[method]();
  }

  async createTimerWindow() {
    const window = new BrowserWindow({
      height: 500,
      width: 500,
      minHeight: 500,
      minWidth: 500,
      fullscreenable: false,
      maximizable: false,
      simpleFullscreen: false,
      fullscreen: false,
      minimizable: false,
      title: WindowTitles.Timer,
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
      minHeight: 600,
      minWidth: 600,
      fullscreenable: true,
      fullscreen: true,
      alwaysOnTop: true,
      minimizable: false,
      maximizable: false,
      title: WindowTitles.Break,
      titleBarStyle: 'hiddenInset',
      resizable: false,
      webPreferences: {
        preload: this.preloadPath,
        nodeIntegration: false,
      },
    });

    window.setAlwaysOnTop(true, 'floating');

    await setupWindow(window, routes.timer(true));

    return window;
  }
}
