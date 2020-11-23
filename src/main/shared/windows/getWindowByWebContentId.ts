import { BrowserWindow } from 'electron';

export const getWindowByWebContentId = (id: number) =>
  BrowserWindow.getAllWindows().find((window) => window.webContents.id === id);
