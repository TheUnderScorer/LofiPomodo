import { BrowserWindow } from 'electron';
import { AppSystemEvents } from '../../../shared/types/system';
import { AppContext } from '../../context';

export const setupSystem = (context: AppContext) => {
  const { ipcService } = context;

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
  });
};
