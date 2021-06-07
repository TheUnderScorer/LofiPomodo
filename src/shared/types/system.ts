import { BrowserWindowConstructorOptions } from 'electron';

export enum AppSystemOperations {
  CloseWindow = 'CloseWindow',
  ToggleWindowSize = 'ToggleWindowSize',
  MinimizeWindow = 'MinimizeWindow',
  GetPlatform = 'GetPlatform',
  GetIs = 'GetIs',
  ResizeWindow = 'ResizeWindow',
  OpenWindow = 'OpenWindow',
  QuitApp = 'QuitApp',
  SupportsDnd = 'SupportsDnd',
}

export interface ResizeWindowPayload
  extends Pick<BrowserWindowConstructorOptions, 'width' | 'height'> {
  animate?: boolean;
}

export interface WindowProps extends Partial<BrowserWindowConstructorOptions> {}

export enum WindowTypes {
  Timer = 'PixelPomodoro',
  Break = 'Break',
  ManageTrello = 'ManageTrello',
  AudioPlayer = 'AudioPlayer',
}

export interface OpenWindowPayload {
  windowType: WindowTypes;
}
