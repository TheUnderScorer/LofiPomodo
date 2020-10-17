import { resolve } from 'path';
import { Application } from 'spectron';
import Electron from 'electron';

export let app: Application;

beforeEach(async () => {
  app = new Application({
    path: Electron as any,
    args: [resolve(__dirname, '../build/electron.js')],
  });

  await app.start();
});

afterEach(async () => {
  if (app?.isRunning()) {
    await app.stop();
  }
});
