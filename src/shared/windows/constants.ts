import { WindowProps, WindowTypes } from '../types/system';
import { is } from 'electron-util';

const timerWindowSize = 500;
const breakWindowSize = 600;

export const windowProps: Record<WindowTypes, WindowProps> = {
  [WindowTypes.Timer]: {
    height: timerWindowSize + 100,
    width: timerWindowSize,
    minHeight: is.windows ? 190 : 216,
    minWidth: timerWindowSize,
  },
  [WindowTypes.Break]: {
    height: breakWindowSize,
    width: breakWindowSize,
    minHeight: breakWindowSize,
    minWidth: breakWindowSize,
  },
};
