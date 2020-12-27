import { app, Menu } from 'electron';
import isDev from 'electron-is-dev';
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

config();

if (!isDev) {
  Object.assign(console, log.functions);
}

log.catchErrors({
  showDialog: true,
});

log.debug(`Dirname: ${__dirname}`);

const setupAppMenu = (context: AppContext) => {
  Menu.setApplicationMenu(context.menuFactory.createAppMenu());

  context.pomodoro.subscribe(() => {
    Menu.setApplicationMenu(context.menuFactory.createAppMenu());
  });
};

app.whenReady().then(async () => {
  try {
    const context = await createContext();

    setupProtocol();

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
    await createErrorDialog(e);

    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.env.CLOSE_ON_ALL_WINDOW_CLOSE === 'true') {
    app.quit();
  }
});
