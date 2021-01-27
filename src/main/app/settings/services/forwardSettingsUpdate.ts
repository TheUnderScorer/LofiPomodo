import { SettingsService } from './SettingsService';
import { sendEventToAllWindows } from '../../../shared/windows/sendEventToAllWindows';
import { SettingsSubscriptionTopics } from '../../../../shared/types/settings';

export const forwardSettingsUpdate = (settingsService: SettingsService) => {
  settingsService.settingsChanged$.subscribe(({ newSettings }) => {
    sendEventToAllWindows(
      SettingsSubscriptionTopics.SettingsUpdated,
      newSettings
    );
  });
};
