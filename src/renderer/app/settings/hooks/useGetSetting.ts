import {
  AppSettings,
  GetSettingPayload,
  SettingsEvents,
} from '../../../../shared/types/settings';
import { IpcQueryArgs, useIpcQuery } from '../../../shared/ipc/useIpcQuery';

export interface GetSettingHookParams extends Omit<IpcQueryArgs, 'variables'> {}

export const useGetSetting = <Key extends keyof AppSettings>(
  key: Key,
  args?: GetSettingHookParams
) => {
  return useIpcQuery<GetSettingPayload, AppSettings[Key]>(
    SettingsEvents.GetSetting,
    {
      variables: {
        key,
      },
      ...args,
    }
  );
};
