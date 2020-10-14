import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';
import url from 'url';
import { createContext } from './context';
import { setupPomodoro } from './app/pomodoro/setup';

const context = createContext();

setupPomodoro(context);

const createWindow = async () => {
  const preload = path.join(__dirname, 'preload.js');

  console.log(`Using ${preload} as preload script.`);

  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    title: 'Lofi Pomodoro',
    webPreferences: {
      preload,
      nodeIntegration: false,
    },
  });

  // Either use dev server when on dev, or production build otherwise.
  const startUrl = isDev
    ? 'http://localhost:3000'
    : url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
      });

  console.log(`Using ${startUrl} as renderer url.`);

  await mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.once('dom-ready', () => {
      mainWindow!.webContents.openDevTools({
        mode: 'right',
      });
    });
  }
};

app.whenReady().then(async () => {
  app.on('activate', async () => {
    if (!BrowserWindow.getAllWindows().length) {
      await createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
