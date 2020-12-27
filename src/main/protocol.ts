import { app, protocol, dialog } from 'electron';
import { name } from '../../package.json';
import { getAppProtocol } from './shared/protocol/getAppProtocol';

export const setupProtocol = () => {
  app.setAsDefaultProtocolClient(name, undefined, ['protocol']);

  protocol.registerHttpProtocol(getAppProtocol('test'), (request) => {
    dialog.showMessageBoxSync({
      title: 'Received request!',
      message: 'Yup ;)',
    });

    console.log({ request });
  });
};
