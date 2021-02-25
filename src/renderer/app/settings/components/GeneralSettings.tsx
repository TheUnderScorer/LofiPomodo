import React from 'react';
import { AppSettings } from '../../../../shared/types/settings';
import { UseFormMethods } from 'react-hook-form';
import { Stack, Switch } from '@chakra-ui/react';
import { SettingsFormController } from '../../../ui/molecules/settingsFormController/SettingsFormController';
import { PixelSwitch } from '../../../ui/molecules/pixelSwitch/PixelSwitch';

export interface GeneralSettingsProps {
  settings: AppSettings;
  form: UseFormMethods<AppSettings>;
}

export const GeneralSettings = ({ form, settings }: GeneralSettingsProps) => {
  return (
    <Stack spacing={6} w="100%">
      <SettingsFormController
        form={form}
        name="autoStart"
        label="Start app on launch"
        defaultValue={settings.autoStart}
      >
        {(props) => (
          <PixelSwitch
            {...props}
            id={props.name}
            onChange={(checked) => props.onChange(checked)}
            isChecked={props.value}
          />
        )}
      </SettingsFormController>
      <SettingsFormController
        form={form}
        name="taskSettings.showToggleTaskListBtn"
        label="Show toggle tasks list button"
        defaultValue={Boolean(settings.taskSettings?.showToggleTaskListBtn)}
      >
        {(props) => (
          <PixelSwitch
            {...props}
            id={props.name}
            onChange={(checked) => props.onChange(checked)}
            isChecked={props.value}
          />
        )}
      </SettingsFormController>
    </Stack>
  );
};
