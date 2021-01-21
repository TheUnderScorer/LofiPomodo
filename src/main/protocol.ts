import { app, dialog, protocol } from 'electron';
import { name } from '../../package.json';

interface HttpProtocolArgs {
  url: string;
}

type HttpProtocolHandler = (args: HttpProtocolArgs) => Promise<void> | void;

const getDeepLinkUrl = (argv: string[]): string | undefined => {
  return argv.find((arg) => arg.includes(name));
};

export const setupProtocol = (handlers: HttpProtocolHandler[] = []) => {
  const callHandlers = async (args: HttpProtocolArgs) => {
    await dialog.showMessageBox({
      message: `Triggered protocol handlers: ${args.url}`,
    });

    await Promise.all(handlers.map((handler) => handler(args)));
  };

  app.setAsDefaultProtocolClient(name);

  /**
   * Handles url passed to second instance
   *
   * @platform Windows
   * */
  app.on('second-instance', async (event, argv) => {
    console.log(`Second instance triggered:`, {
      argv,
      event,
    });

    await dialog.showMessageBox({
      message: `Second instance started: ${argv.join(', ')}`,
    });

    const url = getDeepLinkUrl(argv);

    if (url) {
      await callHandlers({ url });
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
