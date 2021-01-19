import { SpectronClient } from 'spectron';

export const waitForElement = async (
  selector: string,
  client: SpectronClient
) => {
  await client.waitUntil(
    async () => {
      const items = await client.$$(selector);

      return items.length > 0;
    },
    {
      interval: 500,
      timeout: 30000,
      timeoutMsg: `Failed to find element with selector ${selector}`,
    }
  );
};
