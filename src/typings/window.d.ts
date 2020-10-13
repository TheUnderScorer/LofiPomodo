declare global {
  interface Window {
    ipcRenderer: Electron.IpcRenderer;
    appPath: string;
  }
}

export {};
