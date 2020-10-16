import { WindowTitles } from './factories/WindowFactory';
import { BrowserWindow } from 'electron';

export const getWindowByTitle = (title: WindowTitles) => {
  return BrowserWindow.getAllWindows().find((window) => window.title === title);
};
