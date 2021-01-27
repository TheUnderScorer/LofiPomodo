import React, { FC } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { FormControlProps } from '../../../../ui/molecules/formControl/FormControl';
import { DurationField } from '../../../../form/fields/DurationField';
import {
  Divider,
  NumberInput,
  NumberInputField,
  Stack,
  Switch,
} from '@chakra-ui/core';
import { AppSettings } from '../../../../../shared/types/settings';
import { PomodoroSettings } from '../../../../../shared/types';
import { FormController } from '../../../../ui/molecules/formController/FormController';

export interface PomodoroFormProps {
  form: UseFormMethods<AppSettings>;
  settings: PomodoroSettings & { autoStart?: boolean };
}

const formControlProps: Partial<FormControlProps> = {
  width: '450px',
  justifyContent: 'space-between',
  d: 'flex',
  alignItems: 'baseline',
  flexWrap: 'wrap',
};

const maxFieldWidth = '200px';

export const PomodoroForm: FC<PomodoroFormProps> = ({ form, settings }) => {
  return (
    <Stack spacing={6}>
      <FormController
        {...formControlProps}
        label="Work duration"
        name="pomodoroSettings.workDurationSeconds"
        form={form}
        rules={{
          max: 9999,
        }}
      >
        {(props) => <DurationField {...props} maxWidth={maxFieldWidth} />}
      </FormController>
      <FormController
        {...formControlProps}
        form={form}
        label="Break duration"
        name="pomodoroSettings.shortBreakDurationSeconds"
        rules={{
          max: 9999,
        }}
      >
        {(props) => <DurationField {...props} maxWidth={maxFieldWidth} />}
      </FormController>
      <FormController
        label="Long break duration"
        form={form}
        name="pomodoroSettings.longBreakDurationSeconds"
        {...formControlProps}
        defaultValue={settings.longBreakDurationSeconds}
      >
        {(props) => <DurationField {...props} maxWidth={maxFieldWidth} />}
      </FormController>
      <FormController
        form={form}
        label="Short break interval"
        helperInTooltip
        helperText="Amount of short breaks before long break happens"
        defaultValue={settings.longBreakInterval}
        name="pomodoroSettings.longBreakInterval"
        {...formControlProps}
      >
        {(props) => (
          <NumberInput {...props} maxWidth={`calc(${maxFieldWidth} - 40px)`}>
            <NumberInputField />
          </NumberInput>
        )}
      </FormController>
      <FormController
        label="Open separate window on break"
        form={form}
        name="pomodoroSettings.openFullWindowOnBreak"
        defaultValue={settings.openFullWindowOnBreak}
        {...formControlProps}
      >
        {(props) => (
          <Switch
            {...props}
            id={props.name}
            onChange={(event) => props.onChange(event.target.checked)}
            isChecked={props.value}
          />
        )}
      </FormController>
      <FormController
        form={form}
        name="pomodoroSettings.autoRunBreak"
        label="Start break automatically"
        defaultValue={settings.autoRunBreak}
        {...formControlProps}
      >
        {(props) => (
          <Switch
            {...props}
            id={props.name}
            onChange={(event) => props.onChange(event.target.checked)}
            isChecked={props.value}
          />
        )}
      </FormController>
      <FormController
        form={form}
        name="pomodoroSettings.autoRunWork"
        label="Start work automatically"
        defaultValue={settings.autoRunWork}
        {...formControlProps}
      >
        {(props) => (
          <Switch
            {...props}
            id={props.name}
            onChange={(event) => props.onChange(event.target.checked)}
            isChecked={props.value}
          />
        )}
      </FormController>
      <Divider />
      <FormController
        form={form}
        name="autoStart"
        label="Start app on launch"
        defaultValue={settings.autoStart}
        {...formControlProps}
      >
        {(props) => (
          <Switch
            {...props}
            id={props.name}
            onChange={(event) => props.onChange(event.target.checked)}
            isChecked={props.value}
          />
        )}
      </FormController>
    </Stack>
  );
};
