import { BrowserWindow } from 'electron';
import { setupWindow } from './setup';
import { routes } from '../../../../shared/routes/routes';
import { is } from 'electron-util';
import { MenuFactory } from '../../menu/MenuFactory';
import { Nullable } from '../../../../shared/types';
import { windowProps } from '../../../../shared/windows/constants';
import { WindowProps, WindowTypes } from '../../../../shared/types/system';
import { AppStore } from '../../../../shared/types/store';
import ElectronStore from 'electron-store';
import { windowTitles } from '../../../../shared/dictionary/system';

type WindowKeys = 'timerWindow' | 'breakWindow';

export class WindowFactory {
  // Timer window is a main window with a pomodoro timer and tasks list
  public timerWindow: Nullable<BrowserWindow> = null;

  // Break window is an full-screen window that opens once break starts
  public breakWindow: Nullable<BrowserWindow> = null;

  constructor(
    private readonly preloadPath: string,
    private readonly menuFactory: MenuFactory,
    private readonly store: ElectronStore<AppStore>
  ) {}

  async createTimerWindow(): Promise<BrowserWindow> {
    if (this.timerWindow) {
      this.timerWindow.focus();

      return this.timerWindow;
    }

    const window = new BrowserWindow({
      ...this.getWindowProps(WindowTypes.Timer),
      fullscreenable: false,
      maximizable: false,
      simpleFullscreen: false,
      center: true,
      fullscreen: false,
      minimizable: false,
      title: windowTitles[WindowTypes.Timer],
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

    this.registerWindow(window, 'timerWindow', WindowTypes.Timer);

    return window;
  }

  async createBreakWindow(): Promise<BrowserWindow> {
    if (this.breakWindow) {
      this.breakWindow.focus();

      return this.breakWindow;
    }

    const window = new BrowserWindow({
      ...this.getWindowProps(WindowTypes.Break),
      frame: false,
      fullscreenable: true,
      fullscreen: true,
      center: true,
      alwaysOnTop: true,
      minimizable: false,
      maximizable: false,
      title: windowTitles[WindowTypes.Break],
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

    this.registerWindow(window, 'breakWindow', WindowTypes.Break);

    return window;
  }

  // Registers new window into class property and binds events
  private registerWindow(
    window: BrowserWindow,
    key: WindowKeys,
    type: WindowTypes
  ) {
    this.saveWindow(key, window);

    window.on('resize', () => {
      const [width, height] = window.getSize();

      this.store.set(`${type}Props`, {
        width,
        height,
      });
    });
  }

  private getWindowProps(type: WindowTypes): WindowProps {
    const storeProps = this.store.get(`${type}Props`) as
      | WindowProps
      | undefined;

    return {
      ...windowProps[type],
      ...(storeProps ?? {}),
    };
  }

  private saveWindow(
    key: 'timerWindow' | 'breakWindow',
    window: Electron.BrowserWindow
  ) {
    this[key] = window;

    window.once('close', () => {
      console.log(`Window ${window.id} closed.`);

      this[key] = null;
    });
  }
}
