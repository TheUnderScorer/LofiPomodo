import { is } from 'electron-util';
import { WindowProps, WindowTypes } from '../../../shared/types/system';
import {
  breakWindowSize,
  defaultWindowHeight,
  getMinWindowHeight,
  timerWindowSize,
} from '../../../shared/windows/constants';

const baseWindowProps = {
  height: defaultWindowHeight,
  width: timerWindowSize,
  minHeight: getMinWindowHeight(is.windows),
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
export const windowProps: Readonly<
  Record<WindowTypes, Partial<WindowProps>>
> = {
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
    height: baseWindowProps.height + 200,
    width: baseWindowProps.height + 200,
  },
  [WindowTypes.AudioPlayer]: {},
};
