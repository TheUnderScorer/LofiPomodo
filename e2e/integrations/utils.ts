import { ApiProvider } from '../../src/shared/types/integrations/integrations';
import { Application } from 'spectron';
import { waitForElement } from '../helpers/waitForElement';
import { wait } from '../../src/shared/utils/timeout';
import {
  settingsTabIndexArray,
  SettingTab,
} from '../../src/renderer/app/settings/views/SettingsFormView.types';

export const manageIntegration = async (
  provider: ApiProvider,
  app: Application
) => {
  await goToSettings(app, 'Integrations');

  const manageBtn = await app.client.$(`#manage_${provider}`);
  await manageBtn.click();

  await wait(1000);
};

export const goToSettings = async (app: Application, tab: SettingTab) => {
  const settingsBtn = await app.client.$('.settings-btn');
  await settingsBtn.click();

  await waitForElement('.chakra-tabs__tablist', app.client);

  const btns = await app.client.$$('.chakra-tabs__tablist > button');
  const index = settingsTabIndexArray.indexOf(tab);

  await btns[index].click();
};

export const saveSettings = async (app: Application) => {
  const submitBtn = await app.client.$('#submit_settings');

  await submitBtn.click();

  await wait(500);
};
