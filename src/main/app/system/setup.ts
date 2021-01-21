import { app, BrowserWindow } from 'electron';
import {
  AppSystemOperations,
  OpenWindowPayload,
  ResizeWindowPayload,
} from '../../../shared/types/system';
import { AppContext } from '../../context';
import { is } from 'electron-util';

export const setupSystem = (context: AppContext) => {
  const { ipcService, windowFactory } = context;

  ipcService.registerAsMap({
    [AppSystemOperations.QuitApp]: () => {
      app.quit();
    },
    [AppSystemOperations.CloseWindow]: () => {
      return BrowserWindow.getFocusedWindow()?.close();
    },
    [AppSystemOperations.ToggleWindowSize]: () => {
      const window = BrowserWindow.getFocusedWindow();

      if (!window?.isFullScreenable()) {
        return;
      }

      window?.setFullScreen(!window?.isFullScreen());
    },
    [AppSystemOperations.MinimizeWindow]: () => {
      const window = BrowserWindow.getFocusedWindow();

      if (window?.isMinimizable) {
        window?.minimize();
      }
    },
    [AppSystemOperations.GetPlatform]: () => {
      return process.platform;
    },
    [AppSystemOperations.GetIs]: () => {
      return is;
    },
    [AppSystemOperations.ResizeWindow]: (
      _,
      { height, width, animate = true }: ResizeWindowPayload
    ) => {
      const window = BrowserWindow.getFocusedWindow();

      window?.setSize(width, height, animate);
    },
    [AppSystemOperations.OpenWindow]: async (
      _,
      { windowType }: OpenWindowPayload
    ) => {
      await windowFactory.createWindowByType(windowType, {
        parent: BrowserWindow.getFocusedWindow() ?? undefined,
      });
    },
  });
};
