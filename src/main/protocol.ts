import { app, protocol } from 'electron';
import { name } from '../../package.json';

interface HttpProtocolArgs {
  url: string;
}

type HttpProtocolHandler = (args: HttpProtocolArgs) => Promise<void> | void;

const getDeepLinkUrls = (argv: string[]): string[] => {
  return argv.filter((arg) => arg.toLowerCase().includes(name.toLowerCase()));
};

export const setupProtocol = (handlers: HttpProtocolHandler[] = []) => {
  const callHandlers = async (args: HttpProtocolArgs) => {
    await Promise.all(handlers.map((handler) => handler(args)));
  };

  app.setAsDefaultProtocolClient(name);

  /**
   * Handles url passed to second instance
   *
   * @platform Windows
   * */
  app.on('second-instance', async (event, argv) => {
    console.log(`Second instance started ${argv}`);

    const urls = getDeepLinkUrls(argv);

    console.log(`Filtered deep links: ${urls}`);

    if (urls.length) {
      await Promise.all(urls.map((url) => callHandlers({ url })));
    }
  });

  /**
   * @platform OSX|Linux
   * */
  app.on('open-url', async (event, url) => {
    await callHandlers({ url });
  });

  protocol.registerHttpProtocol(name, async (request) => {
    await callHandlers({
      url: request.url,
    });
  });
};
