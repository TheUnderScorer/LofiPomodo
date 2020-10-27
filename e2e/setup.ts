import { resolve } from 'path';
import { Application } from 'spectron';
import Electron from 'electron';
import fetch from 'node-fetch';

export let app: Application;

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

beforeEach(async () => {
  console.log(`Creating app using path ${Electron}`);
  console.log('Waiting for renderer...');

  await waitForRenderer();

  console.log('Renderer ready!');

  app = new Application({
    path: Electron as any,
    args: [resolve(__dirname, '../build/electron.js')],
    quitTimeout: 20000,
    waitTimeout: 20000,
    startTimeout: 10000,
    chromeDriverArgs: [
      '--remote-debugging-port=9222',
      '--no-sandbox',
      '--disable-dev-shm-usage',
    ],
    requireName: 'electronRequire',
  });

  await app.start();
});

async function closeApp() {
  if (app?.isRunning()) {
    await app.stop();
  }
}

afterEach(async () => {
  await closeApp();
});

process.on('beforeExit', async () => {
  await closeApp();
});
