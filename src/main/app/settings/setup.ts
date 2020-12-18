import { AppContext } from '../../context';
import { AppSettings, SettingsEvents } from '../../../shared/types/settings';

export const setupSettings = ({ settingsService, ipcService }: AppContext) => {
  ipcService.registerAsMap({
    [SettingsEvents.GetSettings]: async () => settingsService.getSettings(),
    [SettingsEvents.SetSettings]: async (_, settings: AppSettings) => {
      return await settingsService.setSettings(settings);
    },
  });
};
