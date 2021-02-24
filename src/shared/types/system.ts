export enum AppSystemOperations {
  CloseWindow = 'CloseWindow',
  ToggleWindowSize = 'ToggleWindowSize',
  MinimizeWindow = 'MinimizeWindow',
  GetPlatform = 'GetPlatform',
  GetIs = 'GetIs',
  ResizeWindow = 'ResizeWindow',
  OpenWindow = 'OpenWindow',
  QuitApp = 'QuitApp',
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
  AudioPlayer = 'AudioPlayer',
}

export interface OpenWindowPayload {
  windowType: WindowTypes;
}
