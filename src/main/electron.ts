import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { AppContext, createContext } from './context';
import { setupPomodoro } from './app/pomodoro/setup';

let mainWindow: BrowserWindow | null;

const createWindow = async (context: AppContext) => {
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
  const context = await createContext();

  setupPomodoro(context);

  await createWindow(context);

  app.on('activate', async () => {
    await createWindow(context);
  });
});

app.on('window-all-closed', () => {
  if (process.env.CLOSE_ON_ALL_WINDOW_CLOSE === 'true') {
    app.quit();
  }
});
