import { BrowserWindow } from 'electron';

export const sendEventToAllWindows = (eventName: string, payload?: any) => {
  BrowserWindow.getAllWindows().forEach((window) =>
    window.webContents.send(eventName, payload)
  );
};
