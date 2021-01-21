import { ApiProvider } from '../../src/shared/types/integrations/integrations';
import { Application } from 'spectron';
import { waitForElement } from '../helpers/waitForElement';
import { wait } from '../../src/shared/utils/timeout';

export const manageIntegration = async (
  provider: ApiProvider,
  app: Application
) => {
  await goToSettings(app, 'Integrations');

  const manageBtn = await app.client.$(`#manage_${provider}`);
  await manageBtn.click();

  await wait(1000);
};

export const goToSettings = async (
  app: Application,
  tab: 'Settings' | 'Integrations'
) => {
  const settingsBtn = await app.client.$('.settings-btn');
  await settingsBtn.click();

  await waitForElement('.chakra-tabs__tablist', app.client);

  const btns = await app.client.$$('.chakra-tabs__tablist > button');
  const index = tab === 'Settings' ? 0 : 1;

  await btns[index].click();
};
