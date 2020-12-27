import { AppContext } from '../../context';
import {
  AppSettings,
  GetSettingPayload,
  SettingsEvents,
} from '../../../shared/types/settings';

export const setupSettings = ({ settingsService, ipcService }: AppContext) => {
  ipcService.registerAsMap({
    [SettingsEvents.GetSettings]: async () => settingsService.getSettings(),
    [SettingsEvents.SetSettings]: async (_, settings: AppSettings) => {
      return await settingsService.setSettings(settings);
    },
    [SettingsEvents.GetSetting]: async (_, { key }: GetSettingPayload) => {
      return settingsService.getSetting(key);
    },
  });
};
