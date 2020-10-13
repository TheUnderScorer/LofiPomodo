import { BrowserWindow } from 'electron';

export const getWindowById = (id: number) =>
  BrowserWindow.getAllWindows().find(window => window.id === id);
