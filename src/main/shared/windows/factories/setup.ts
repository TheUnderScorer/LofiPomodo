import { BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';
import { is } from 'electron-util';

export const setupWindow = async (window: BrowserWindow, windowUrl: string) => {
  // Either use dev server when on dev, or production build otherwise.
  const windowUrlToLoad =
    is.development && process.env.NODE_ENV !== 'production'
      ? url.format({
          pathname: '//localhost:3000/',
          protocol: 'http',
          query: {
            path: windowUrl,
          },
        })
      : url.format({
          pathname: path.join(__dirname, 'index.html'),
          protocol: 'file:',
          slashes: true,
          query: {
            path: windowUrl,
          },
        });

  console.log(`Using ${windowUrlToLoad} as renderer url.`);

  await window.loadURL(windowUrlToLoad);

  window.webContents.on('before-input-event', (_, input) => {
    if (input.key === 'F12') {
      window.webContents.openDevTools({ mode: 'detach' });
    }
  });

  return window;
};
