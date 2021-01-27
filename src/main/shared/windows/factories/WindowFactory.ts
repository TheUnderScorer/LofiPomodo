import { BrowserWindow } from 'electron';
import { setupWindow } from './setup';
import { routes } from '../../../../shared/routes/routes';
import { MenuFactory } from '../../menu/MenuFactory';
import { Nullable } from '../../../../shared/types';
import { windowProps } from '../../../../shared/windows/constants';
import { WindowProps, WindowTypes } from '../../../../shared/types/system';
import { AppStore } from '../../../../shared/types/store';
import ElectronStore from 'electron-store';
import { windowTitles } from '../../../../shared/dictionary/system';

type WindowKeys = 'timerWindow' | 'breakWindow' | 'manageTrelloWindow';

export interface CreateWindowArgs {
  parent?: BrowserWindow;
}

export class WindowFactory {
  // Timer window is a main window with a pomodoro timer and tasks list
  public timerWindow: Nullable<BrowserWindow> = null;

  // Break window is an full-screen window that opens once break starts
  public breakWindow: Nullable<BrowserWindow> = null;

  public manageTrelloWindow: Nullable<BrowserWindow> = null;

  public audioPlayerWindows = new Set<BrowserWindow>();

  private windowKeyMethodMap: Record<
    WindowTypes,
    (args?: CreateWindowArgs) => Promise<BrowserWindow>
  > = {
    [WindowTypes.Break]: this.createBreakWindow.bind(this),
    [WindowTypes.Timer]: this.createTimerWindow.bind(this),
    [WindowTypes.ManageTrello]: this.createManageTrelloWindow.bind(this),
    [WindowTypes.AudioPlayer]: this.createAudioPlayerWindow.bind(this),
  };

  constructor(
    private readonly preloadPath: string,
    private readonly menuFactory: MenuFactory,
    private readonly store: ElectronStore<AppStore>
  ) {}

  async createWindowByType(type: WindowTypes, args?: CreateWindowArgs) {
    const method = this.windowKeyMethodMap[type];

    if (!method) {
      throw new TypeError(`No method defined for window ${type}`);
    }

    return method(args);
  }

  async createManageTrelloWindow({
    parent,
  }: CreateWindowArgs = {}): Promise<BrowserWindow> {
    if (this.manageTrelloWindow) {
      this.manageTrelloWindow.focus();

      return this.manageTrelloWindow;
    }

    const window = new BrowserWindow({
      ...this.getWindowProps(WindowTypes.ManageTrello),
      title: windowTitles[WindowTypes.ManageTrello],
      parent,
      webPreferences: {
        preload: this.preloadPath,
        nodeIntegration: false,
      },
    });

    await setupWindow(window, routes.manageTrello());

    this.registerWindow(window, 'manageTrelloWindow', WindowTypes.ManageTrello);

    return window;
  }

  async createTimerWindow({
    parent,
  }: CreateWindowArgs = {}): Promise<BrowserWindow> {
    if (this.timerWindow) {
      this.timerWindow.focus();

      return this.timerWindow;
    }

    const window = new BrowserWindow({
      ...this.getWindowProps(WindowTypes.Timer),
      title: windowTitles[WindowTypes.Timer],
      parent,
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

  async createAudioPlayerWindow() {
    const window = new BrowserWindow({
      show: false,
      height: 400,
      width: 400,
      webPreferences: {
        preload: this.preloadPath,
      },
    });

    await setupWindow(window, routes.hiddenAudioPlayer());

    this.audioPlayerWindows.add(window);

    window.on('close', () => {
      WindowFactory.logWindowClosed(window);

      this.audioPlayerWindows.delete(window);
    });

    return window;
  }

  async createBreakWindow({
    parent,
  }: CreateWindowArgs = {}): Promise<BrowserWindow> {
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
      minimizable: false,
      maximizable: false,
      title: windowTitles[WindowTypes.Break],
      titleBarStyle: 'hidden',
      resizable: false,
      parent,
      webPreferences: {
        preload: this.preloadPath,
        nodeIntegration: false,
      },
    });

    window.setAlwaysOnTop(true, 'floating');
    window.setMenu(this.menuFactory.createAppMenu());

    await setupWindow(window, routes.breakWindow());

    this.registerWindow(window, 'breakWindow', WindowTypes.Break);

    window.focus();

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
      ...(windowProps[type] as WindowProps),
      ...(storeProps ?? {}),
    };
  }

  private saveWindow(key: WindowKeys, window: Electron.BrowserWindow) {
    this[key] = window;

    window.once('close', () => {
      WindowFactory.logWindowClosed(window);

      this[key] = null;
    });
  }

  private static logWindowClosed(window: Electron.BrowserWindow) {
    console.log(`Window ${window.id} closed.`);
  }
}
