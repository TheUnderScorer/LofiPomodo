export enum AppSystemEvents {
  CloseWindow = 'CloseWindow',
  ToggleWindowSize = 'ToggleWindowSize',
  MinimizeWindow = 'MinimizeWindow',
  GetPlatform = 'GetPlatform',
  ResizeWindow = 'ResizeWindow',
}

export interface ResizeWindowPayload {
  width: number;
  height: number;
  animate?: boolean;
}

export interface WindowProps extends ResizeWindowPayload {
  minHeight?: number;
  minWidth?: number;
}

export enum WindowTitles {
  Timer = 'Pixel Pomodoro',
  Break = 'Break',
}
