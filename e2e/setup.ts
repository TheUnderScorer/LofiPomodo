import { resolve } from 'path';
import { Application } from 'spectron';
import Electron from 'electron';
import fetch from 'node-fetch';

let runningApps: Application[] = [];

const waitForRenderer = async () => {
  return new Promise((resolve) => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:3000');

        if (response.status === 200) {
          clearInterval(intervalId);
          resolve();
        }
      } catch {
        // Nothing here ;)
      }
    }, 2000);
  });
};

export const bootstrapTestApp = async (env: object = {}) => {
  console.log(`Creating app using path ${Electron}`);
  console.log('Waiting for renderer...');

  await waitForRenderer();

  console.log('Renderer ready!');

  const app = new Application({
    path: Electron as any,
    args: [resolve(__dirname, '../build/electron.js')],
    quitTimeout: 20000,
    waitTimeout: 20000,
    startTimeout: 10000,
    env: {
      ...process.env,
      ...env,
      CLOSE_ON_ALL_WINDOW_CLOSE: 'true',
      CLEAR_DB_ON_RUN: 'true',
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
};

export const closeApps = async () => {
  console.log(`Found ${runningApps.length} running apps.`);

  let clearedApps = 0;

  await Promise.all(
    runningApps.map(async (app) => {
      if (app.isRunning()) {
        await app.stop();

        clearedApps += 1;
      }
    })
  );

  console.log(`Stopped ${clearedApps} apps.`);

  runningApps = [];
};

afterEach(async () => {
  await closeApps();
});
