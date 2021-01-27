import { AppContext } from '../../context';
import {
  AppSettings,
  GetSettingPayload,
  SettingsOperations,
} from '../../../shared/types/settings';
import { forwardSettingsUpdate } from './services/forwardSettingsUpdate';

export const setupSettings = ({ settingsService, ipcService }: AppContext) => {
  forwardSettingsUpdate(settingsService);

  ipcService.registerAsMap({
    [SettingsOperations.GetSettings]: async () => settingsService.getSettings(),
    [SettingsOperations.SetSettings]: async (_, settings: AppSettings) => {
      return await settingsService.setSettings(settings);
    },
    [SettingsOperations.GetSetting]: async (_, { key }: GetSettingPayload) => {
      return settingsService.getSetting(key);
    },
  });
};
