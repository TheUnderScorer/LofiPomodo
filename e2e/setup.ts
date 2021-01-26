import { resolve } from 'path';
import { Application } from 'spectron';
import Electron from 'electron';
import { waitForRenderer } from '../src/main/shared/utils/dev';

let runningApps: Application[] = [];

const closeAllWindows = async (app: Application) => {
  const allWindows = await app.client.getWindowCount();

  for (let i = 0; i < allWindows; i++) {
    await app.client.windowByIndex(i);

    try {
      await app.client.execute(() => {
        window.close();
      });
    } catch (e) {
      console.error(`Failed to close window ${i} - ${e.message}`);
    }
  }
};

export const bootstrapTestApp = async (env: object = {}) => {
  try {
    const app = new Application({
      path: Electron as any,
      args: [resolve(__dirname, '..')],
      quitTimeout: 20000,
      waitTimeout: 20000,
      startTimeout: 40000,
      env: {
        ...process.env,
        ...env,
        CLOSE_ON_ALL_WINDOW_CLOSE: 'true',
        CLEAR_DB_ON_RUN: 'true',
        CLEAR_STORE_ON_APP_RUN: 'true',
        TEST: 'true',
      },
      chromeDriverArgs: [
        '--remote-debugging-port=9222',
        '--no-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    await app.start();

    runningApps.push(app);

    return app;
  } catch (e) {
    console.error(`Failed to bootstrap test app`, e);

    throw e;
  }
};

export const closeApps = async () => {
  await Promise.all(
    runningApps.map(async (app) => {
      if (app.isRunning()) {
        try {
          await closeAllWindows(app);
          await app.stop();
        } catch (e) {
          console.error(`Failed to stop app - ${e.message}`);
        }
      }
    })
  );

  runningApps = [];
};

afterEach(async () => {
  await closeApps();
});
