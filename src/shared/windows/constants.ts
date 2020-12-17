import { WindowProps, WindowTitles } from '../types/system';

const timerWindowSize = 500;
const breakWindowSize = 600;

export const windowProps: Record<WindowTitles, WindowProps> = {
  [WindowTitles.Timer]: {
    height: timerWindowSize + 100,
    width: timerWindowSize,
    minHeight: timerWindowSize + 100,
    minWidth: timerWindowSize,
  },
  [WindowTitles.Break]: {
    height: breakWindowSize,
    width: breakWindowSize,
    minHeight: breakWindowSize,
    minWidth: breakWindowSize,
  },
};
