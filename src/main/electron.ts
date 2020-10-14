import { app } from 'electron';
import isDev from 'electron-is-dev';
import { createContext } from './context';
import { setupPomodoro } from './app/pomodoro/setup';

const context = createContext();

setupPomodoro(context);

const createWindow = async () => {
  console.log(`Using ${context.preloadPath} as preload script.`);

  const mainWindow = await context.windowFactory.createTimerWindow();

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
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
