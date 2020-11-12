declare global {
  interface Window {
    ipcRenderer: Electron.IpcRenderer;
    appPath: string;
    platform: typeof process.platform;
  }
}

export {};
