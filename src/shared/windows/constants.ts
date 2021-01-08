import { WindowProps, WindowTypes } from '../types/system';
import { is } from 'electron-util';

const timerWindowSize = 500;
const breakWindowSize = 600;

const baseWindowProps = {
  height: timerWindowSize + 100,
  width: timerWindowSize,
  minHeight: is.windows ? 190 : 216,
  minWidth: timerWindowSize,
  fullscreenable: false,
  maximizable: false,
  simpleFullscreen: false,
  center: true,
  fullscreen: false,
  minimizable: false,
  titleBarStyle: is.windows ? 'customButtonsOnHover' : 'hiddenInset',
  frame: !is.windows,
};

export const windowProps: Readonly<Record<WindowTypes, WindowProps>> = {
  [WindowTypes.Timer]: {
    ...baseWindowProps,
  },
  [WindowTypes.Break]: {
    height: breakWindowSize,
    width: breakWindowSize,
    minHeight: breakWindowSize,
    minWidth: breakWindowSize,
  },
  [WindowTypes.ManageTrello]: {
    ...baseWindowProps,
  },
};
