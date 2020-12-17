import { BrowserWindow } from 'electron';
import { setupWindow } from './setup';
import { routes } from '../../../../shared/routes/routes';
import { is } from 'electron-util';
import { MenuFactory } from '../../menu/MenuFactory';
import { Nullable } from '../../../../shared/types';
import { windowProps } from '../../../../shared/windows/constants';
import { WindowTitles } from '../../../../shared/types/system';

type WindowKeys = 'timerWindow' | 'breakWindow';

export class WindowFactory {
  // Timer window is a main window with a pomodoro timer and tasks list
  public timerWindow: Nullable<BrowserWindow> = null;

  // Break window is an full-screen window that opens once break starts
  public breakWindow: Nullable<BrowserWindow> = null;

  constructor(
    private readonly preloadPath: string,
    private readonly menuFactory: MenuFactory
  ) {}

  async createTimerWindow(): Promise<BrowserWindow> {
    if (this.timerWindow) {
      return this.timerWindow;
    }

    const window = new BrowserWindow({
      ...windowProps[WindowTitles.Timer],
      fullscreenable: false,
      maximizable: false,
      simpleFullscreen: false,
      center: true,
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

    this.registerWindow(window, 'timerWindow');

    return window;
  }

  async createBreakWindow(): Promise<BrowserWindow> {
    const window = new BrowserWindow({
      ...windowProps[WindowTitles.Break],
      frame: false,
      fullscreenable: true,
      fullscreen: true,
      center: true,
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
    window.setMenu(this.menuFactory.createAppMenu());

    await setupWindow(window, routes.breakWindow());

    this.registerWindow(window, 'breakWindow');

    return window;
  }

  // Registers new window into class property, and listens on "closed" events after which the reference to window is removed
  private registerWindow(window: BrowserWindow, key: WindowKeys) {
    this[key] = window;

    window.once('close', () => {
      this[key] = null;
    });
  }
}
