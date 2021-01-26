import React, { FC } from 'react';
import { Controller, UseFormMethods } from 'react-hook-form';
import {
  FormControl,
  FormControlProps,
} from '../../../../ui/molecules/formControl/FormControl';
import { DurationField } from '../../../../form/fields/DurationField';
import { Divider, Input, Stack, Switch } from '@chakra-ui/core';
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
  const { errors, control } = form;

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
      <FormControl
        {...formControlProps}
        contentBoxProps={{
          flexDirection: 'column',
        }}
        error={errors.pomodoroSettings?.longBreakDurationSeconds?.message}
        label="Long break duration"
      >
        <Controller
          defaultValue={settings.longBreakDurationSeconds}
          name="pomodoroSettings.longBreakDurationSeconds"
          control={control}
          rules={{
            max: 9999,
          }}
          render={(props) => (
            <DurationField {...props} maxWidth={maxFieldWidth} />
          )}
        />
      </FormControl>
      <FormControl
        {...formControlProps}
        error={errors.pomodoroSettings?.longBreakInterval?.message}
        label="Short break interval"
        helperInTooltip
        helperText="Amount of short breaks before long break happens"
      >
        <Controller
          name="pomodoroSettings.longBreakInterval"
          defaultValue={settings.longBreakInterval}
          control={control}
          rules={{
            max: {
              value: 99,
              message: 'Value cannot be larger than 99',
            },
            min: {
              value: 2,
              message: 'Value cannot be smaller than 2',
            },
          }}
          render={(props) => (
            <Input
              {...props}
              maxWidth={`calc(${maxFieldWidth} - 40px)`}
              type="number"
            />
          )}
        />
      </FormControl>
      <FormControl
        {...formControlProps}
        error={errors.pomodoroSettings?.openFullWindowOnBreak?.message}
        name="pomodoroSettings.openFullWindowOnBreak"
        label="Open separate window on break"
      >
        <Controller
          defaultValue={settings.openFullWindowOnBreak}
          name="pomodoroSettings.openFullWindowOnBreak"
          control={control}
          render={(props) => (
            <Switch
              {...props}
              id={props.name}
              onChange={(event) => props.onChange(event.target.checked)}
              isChecked={props.value}
            />
          )}
        />
      </FormControl>
      <FormControl
        {...formControlProps}
        error={errors.pomodoroSettings?.autoRunBreak?.message}
        name="pomodoroSettings.autoRunBreak"
        label="Start break automatically"
      >
        <Controller
          defaultValue={settings.autoRunBreak}
          name="pomodoroSettings.autoRunBreak"
          control={control}
          render={(props) => (
            <Switch
              {...props}
              id={props.name}
              onChange={(event) => props.onChange(event.target.checked)}
              isChecked={props.value}
            />
          )}
        />
      </FormControl>
      <FormControl
        {...formControlProps}
        error={errors.pomodoroSettings?.autoRunWork?.message}
        name="pomodoroSettings.autoRunWork"
        label="Start work automatically"
      >
        <Controller
          defaultValue={settings.autoRunWork}
          name="pomodoroSettings.autoRunWork"
          control={control}
          render={(props) => (
            <Switch
              {...props}
              id={props.name}
              onChange={(event) => props.onChange(event.target.checked)}
              isChecked={props.value}
            />
          )}
        />
      </FormControl>
      <Divider />
      <FormControl
        {...formControlProps}
        error={errors.autoStart?.message}
        name="autoStart"
        label="Start app on launch"
      >
        <Controller
          name="autoStart"
          defaultValue={settings.autoStart}
          control={control}
          render={(props) => (
            <Switch
              {...props}
              id={props.name}
              onChange={(event) => props.onChange(event.target.checked)}
              isChecked={props.value}
            />
          )}
        />
      </FormControl>
    </Stack>
  );
};
