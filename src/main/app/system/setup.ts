import { app, BrowserWindow } from 'electron';
import {
  AppSystemOperations,
  OpenWindowPayload,
  ResizeWindowPayload,
} from '../../../shared/types/system';
import { AppContext } from '../../context';
import { is } from 'electron-util';
import { ResizeWindowPayloadSchema } from '../../../shared/schema/system/ResizeWindowPayloadSchema';

export const setupSystem = (context: AppContext) => {
  const { ipcService, windowFactory, dndService } = context;

  ipcService.registerAsMap({
    [AppSystemOperations.QuitApp]: () => {
      app.quit();
    },
    [AppSystemOperations.SupportsDnd]: () => dndService.supported,
    [AppSystemOperations.CloseWindow]: (event) => {
      const window = BrowserWindow.fromWebContents(event.sender);

      window?.close();
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
    [AppSystemOperations.ResizeWindow]: async (
      _,
      payload: ResizeWindowPayload
    ) => {
      const { width, animate, height } =
        ResizeWindowPayloadSchema.validate(payload);

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
