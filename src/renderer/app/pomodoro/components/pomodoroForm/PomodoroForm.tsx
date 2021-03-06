import React from 'react';
import { UseFormMethods } from 'react-hook-form';
import { DurationField } from '../../../../form/fields/DurationField';
import {
  Divider,
  NumberInput,
  NumberInputField,
  Stack,
} from '@chakra-ui/react';
import { AppSettings } from '../../../../../shared/types/settings';
import { PomodoroSettings } from '../../../../../shared/types';
import { AudioSelect } from '../../../audio/components/AudioSelect';
import { SettingsFormController } from '../../../../ui/molecules/settingsFormController/SettingsFormController';
import { FormController } from '../../../../ui/molecules/formController/FormController';
import { PixelSwitch } from '../../../../ui/molecules/pixelSwitch/PixelSwitch';
import { useSupportsDnd } from '../../../../shared/hooks/useSupportsDnd';

export interface PomodoroFormProps {
  form: UseFormMethods<AppSettings>;
  settings: PomodoroSettings;
}

const maxFieldWidth = '200px';

export const PomodoroForm = ({ form, settings }: PomodoroFormProps) => {
  const { isSupported: dndSupported } = useSupportsDnd();

  return (
    <Stack spacing={6} width="100%">
      <SettingsFormController
        label="Work duration"
        name="pomodoroSettings.workDurationSeconds"
        form={form}
        rules={{
          max: 9999,
        }}
      >
        {(props) => <DurationField {...props} maxWidth={maxFieldWidth} />}
      </SettingsFormController>
      <SettingsFormController
        form={form}
        label="Break duration"
        name="pomodoroSettings.shortBreakDurationSeconds"
        rules={{
          max: 9999,
        }}
      >
        {(props) => <DurationField {...props} maxWidth={maxFieldWidth} />}
      </SettingsFormController>
      <SettingsFormController
        label="Long break duration"
        form={form}
        name="pomodoroSettings.longBreakDurationSeconds"
        defaultValue={settings.longBreakDurationSeconds}
      >
        {(props) => <DurationField {...props} maxWidth={maxFieldWidth} />}
      </SettingsFormController>
      <SettingsFormController
        form={form}
        label="Short break interval"
        helperInTooltip
        helperText="Amount of short breaks before long break happens"
        defaultValue={settings.longBreakInterval}
        name="pomodoroSettings.longBreakInterval"
      >
        {(props) => (
          <NumberInput {...props} maxWidth={`calc(${maxFieldWidth} - 40px)`}>
            <NumberInputField />
          </NumberInput>
        )}
      </SettingsFormController>
      <SettingsFormController
        label="Open separate window on break"
        form={form}
        name="pomodoroSettings.openFullWindowOnBreak"
        defaultValue={settings.openFullWindowOnBreak}
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
        name="pomodoroSettings.autoRunBreak"
        label="Start break automatically"
        defaultValue={settings.autoRunBreak}
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
        name="pomodoroSettings.autoRunWork"
        label="Start work automatically"
        defaultValue={settings.autoRunWork}
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
      {dndSupported && (
        <SettingsFormController
          form={form}
          name="pomodoroSettings.dndOnBreak"
          label={'Enable "Do Not Disturb" mode on break'}
          defaultValue={settings.dndOnBreak}
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
      )}
      <SettingsFormController
        label="Show notification before break"
        form={form}
        name="pomodoroSettings.showNotificationBeforeBreak"
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
      <Divider />
      <FormController
        form={form}
        name="pomodoroSettings.workSound"
        label="Sound to play when work starts"
        defaultValue={settings.workSound}
      >
        {(props) => <AudioSelect color="brand.textPrimary" {...props} />}
      </FormController>
      <FormController
        form={form}
        name="pomodoroSettings.breakSound"
        label="Sound to play when break starts"
        defaultValue={settings.breakSound}
      >
        {(props) => <AudioSelect color="brand.textPrimary" {...props} />}
      </FormController>
      <FormController
        form={form}
        name="pomodoroSettings.longBreakSound"
        label="Sound to play when long break starts"
        defaultValue={settings.longBreakSound}
      >
        {(props) => <AudioSelect color="brand.textPrimary" {...props} />}
      </FormController>
    </Stack>
  );
};
