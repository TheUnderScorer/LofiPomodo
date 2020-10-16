import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { createContext } from './context';
import { setupPomodoro } from './app/pomodoro/setup';

let mainWindow: BrowserWindow | null;

const context = createContext();

setupPomodoro(context);

const createWindow = async () => {
  if (mainWindow) {
    return;
  }

  mainWindow = await context.windowFactory.createTimerWindow();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (isDev) {
    mainWindow.webContents.once('dom-ready', () => {
      mainWindow!.webContents.openDevTools({
        mode: 'right',
      });
    });
  }
};

app.whenReady().then(async () => {
  await createWindow();

  app.on('activate', async () => {
    await createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
