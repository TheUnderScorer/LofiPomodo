import { app } from '../setup';

describe('Example e2e', () => {
  it('should bootstrap', async () => {
    expect(app.isRunning()).toEqual(true);

    await expect(app.client.getWindowCount()).resolves.toEqual(1);
  });
});
