import { app, Menu } from 'electron';
import { AppContext, createContext } from './context';
import { setupPomodoro } from './app/pomodoro/setup';
import { setupTasks } from './app/tasks/setup';
import log from 'electron-log';
import { setupSystem } from './app/system/setup';
import { setupSettings } from './app/settings/setup';
import { config } from 'dotenv';
import { setupIntegrations } from './app/integrations/setup';
import { setupProtocol } from './protocol';
import { createErrorDialog } from './shared/dialog/factories/errorDialog';
import path from 'path';
import { setupSingleInstance } from './singleInstance';
import { is } from 'electron-util';
import { waitForRenderer } from './shared/utils/dev';
import { setupAudio } from './app/audio/setup';

if (require('electron-squirrel-startup')) {
  app.quit();
}

const envPath = path.resolve(__dirname, `../.env`);

config({
  path: envPath,
});

if (!is.development) {
  Object.assign(console, log.functions);
}

log.catchErrors({
  showDialog: true,
});

log.debug(`Dirname: ${__dirname}`);

const setupAppMenu = (context: AppContext) => {
  Menu.setApplicationMenu(context.menuFactory.createAppMenu());

  context.pomodoroService.changed$.subscribe(() => {
    Menu.setApplicationMenu(context.menuFactory.createAppMenu());
  });
};

app.whenReady().then(async () => {
  try {
    if (is.development && process.env.TEST !== 'true') {
      await waitForRenderer();
    }

    const context = await createContext();

    setupSingleInstance(context.windowFactory);

    setupProtocol([
      ({ url }) => context.apiAuthService.handleAuthProtocol(url),
    ]);

    setupAudio(context);
    setupAppMenu(context);
    setupPomodoro(context);
    setupTasks(context);
    setupSystem(context);
    setupSettings(context);
    setupIntegrations(context);

    await context.windowFactory.createTimerWindow();
    app.on('activate', async () => {
      await context.windowFactory.createTimerWindow();
    });
  } catch (e) {
    console.error(e);

    await createErrorDialog(e);

    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.env.CLOSE_ON_ALL_WINDOW_CLOSE === 'true') {
    app.quit();
  }
});
