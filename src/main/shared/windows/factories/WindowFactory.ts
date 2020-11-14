import { BrowserWindow } from 'electron';
import { setupWindow } from './setup';
import { routes } from '../../../../shared/routes/routes';
import { getWindowByTitle } from '../getWindowByTitle';
import { is } from 'electron-util';
import { MenuFactory } from '../../menu/MenuFactory';

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

  constructor(
    private readonly preloadPath: string,
    private readonly menuFactory: MenuFactory
  ) {}

  async getOrCreateWindow(title: WindowTitles) {
    const foundWindow = getWindowByTitle(title);

    if (foundWindow) {
      return foundWindow;
    }

    const method = WindowFactory.windowMap[title];

    return this[method]();
  }

  async createTimerWindow() {
    const size = 500;

    const window = new BrowserWindow({
      height: size + 100,
      width: size,
      minHeight: size + 100,
      minWidth: size,
      fullscreenable: false,
      maximizable: false,
      simpleFullscreen: false,
      fullscreen: false,
      minimizable: false,
      title: WindowTitles.Timer,
      titleBarStyle: is.windows ? 'customButtonsOnHover' : 'hiddenInset',
      frame: !is.windows,
      webPreferences: {
        preload: this.preloadPath,
        nodeIntegration: false,
      },
    });

    await setupWindow(window, routes.timer());

    const menu = this.menuFactory.createAppMenu();
    window.setMenu(menu);

    return window;
  }

  async createBreakWindow() {
    const window = new BrowserWindow({
      height: 600,
      width: 600,
      frame: false,
      minHeight: 600,
      minWidth: 600,
      fullscreenable: true,
      fullscreen: true,
      alwaysOnTop: true,
      minimizable: false,
      maximizable: false,
      title: WindowTitles.Break,
      titleBarStyle: 'hidden',
      resizable: false,
      webPreferences: {
        preload: this.preloadPath,
        nodeIntegration: false,
      },
    });

    window.setAlwaysOnTop(true, 'floating');

    await setupWindow(window, routes.breakWindow());

    return window;
  }
}
