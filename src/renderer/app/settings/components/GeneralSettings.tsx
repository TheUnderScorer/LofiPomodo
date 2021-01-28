import React from 'react';
import { AppSettings } from '../../../../shared/types/settings';
import { UseFormMethods } from 'react-hook-form';
import { Stack, Switch } from '@chakra-ui/core';
import { SettingsFormController } from '../../../ui/molecules/settingsFormController/SettingsFormController';

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
          <Switch
            {...props}
            id={props.name}
            onChange={(event) => props.onChange(event.target.checked)}
            isChecked={props.value}
          />
        )}
      </SettingsFormController>
      <SettingsFormController
        form={form}
        name="taskSettings.showToggleTaskListBtn"
        label="Show button for toggling task list"
        defaultValue={Boolean(settings.taskSettings?.showToggleTaskListBtn)}
      >
        {(props) => (
          <Switch
            {...props}
            id={props.name}
            onChange={(event) => props.onChange(event.target.checked)}
            isChecked={props.value}
          />
        )}
      </SettingsFormController>
    </Stack>
  );
};
