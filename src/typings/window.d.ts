import { is } from 'electron-util';

declare global {
  interface Window {
    ipcRenderer: Electron.IpcRenderer;
    appPath: string;
    platform: typeof process.platform;
    is: typeof is;
  }
}

export {};
