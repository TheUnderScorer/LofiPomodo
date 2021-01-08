import { BrowserWindow } from 'electron';
import {
  AppSystemEvents,
  OpenWindowPayload,
  ResizeWindowPayload,
} from '../../../shared/types/system';
import { AppContext } from '../../context';
import { is } from 'electron-util';

export const setupSystem = (context: AppContext) => {
  const { ipcService, windowFactory } = context;

  ipcService.registerAsMap({
    [AppSystemEvents.CloseWindow]: () =>
      BrowserWindow.getFocusedWindow()?.close(),
    [AppSystemEvents.ToggleWindowSize]: () => {
      const window = BrowserWindow.getFocusedWindow();

      if (!window?.isFullScreenable()) {
        return;
      }

      window?.setFullScreen(!window?.isFullScreen());
    },
    [AppSystemEvents.MinimizeWindow]: () => {
      const window = BrowserWindow.getFocusedWindow();

      if (window?.isMinimizable) {
        window?.minimize();
      }
    },
    [AppSystemEvents.GetPlatform]: () => {
      return process.platform;
    },
    [AppSystemEvents.GetIs]: () => {
      return is;
    },
    [AppSystemEvents.ResizeWindow]: (
      _,
      { height, width, animate = true }: ResizeWindowPayload
    ) => {
      const window = BrowserWindow.getFocusedWindow();

      window?.setSize(width, height, animate);
    },
    [AppSystemEvents.OpenWindow]: async (
      _,
      { windowType }: OpenWindowPayload
    ) => {
      await windowFactory.createWindowByType(windowType);
    },
  });
};
