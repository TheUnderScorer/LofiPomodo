export enum AppSystemEvents {
  CloseWindow = 'CloseWindow',
  ToggleWindowSize = 'ToggleWindowSize',
  MinimizeWindow = 'MinimizeWindow',
  GetPlatform = 'GetPlatform',
  GetIs = 'GetIs',
  ResizeWindow = 'ResizeWindow',
  OpenWindow = 'OpenWindow',
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

export enum WindowTypes {
  Timer = 'PixelPomodoro',
  Break = 'Break',
  ManageTrello = 'ManageTrello',
}

export interface OpenWindowPayload {
  windowType: WindowTypes;
}
