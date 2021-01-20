import { ApiProvider } from '../../src/shared/types/integrations/integrations';
import { Application } from 'spectron';
import { waitForElement } from '../helpers/waitForElement';

export const manageIntegration = async (
  provider: ApiProvider,
  app: Application
) => {
  const settingsBtn = await app.client.$('.settings-btn');
  await settingsBtn.click();

  await waitForElement('.chakra-tabs__tablist', app.client);

  const btns = await app.client.$$('.chakra-tabs__tablist > button');
  await btns[1].click();

  const manageBtn = await app.client.$(`#manage_${provider}`);
  await manageBtn.click();
};
