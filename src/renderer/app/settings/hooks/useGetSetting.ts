import {
  AppSettings,
  GetSettingPayload,
  SettingsEvents,
} from '../../../../shared/types/settings';
import { useIpcQuery } from '../../../shared/ipc/useIpcQuery';

export const useGetSetting = <Key extends keyof AppSettings>(key: Key) => {
  return useIpcQuery<GetSettingPayload, AppSettings[Key]>(
    SettingsEvents.GetSetting,
    {
      variables: {
        key,
      },
    }
  );
};
