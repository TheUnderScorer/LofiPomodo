import { app, dialog, protocol } from 'electron';
import { name } from '../../package.json';

interface HttpProtocolArgs {
  url: string;
}

type HttpProtocolHandler = (args: HttpProtocolArgs) => Promise<void> | void;

export const setupProtocol = (handlers: HttpProtocolHandler[] = []) => {
  const callHandlers = async (args: HttpProtocolArgs) => {
    await Promise.all(handlers.map((handler) => handler(args)));
  };

  app.setAsDefaultProtocolClient(name);

  app.on('open-url', async (event, url) => {
    dialog.showMessageBoxSync({
      title: 'Received request!',
      message: `Url: ${url}`,
    });

    await callHandlers({ url });
  });

  protocol.registerHttpProtocol(name, async (request) => {
    await callHandlers({
      url: request.url,
    });
  });
};
