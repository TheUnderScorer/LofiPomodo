import React, { FC } from 'react';
import { Controller, UseFormMethods } from 'react-hook-form';
import { PomodoroSettings } from '../../../../../shared/types';
import {
  FormControl,
  FormControlProps,
} from '../../../../ui/atoms/formControl/FormControl';
import { DurationField } from '../../../../form/fields/DurationField';
import { Divider, Stack, Switch } from '@chakra-ui/core';
import { AutostartSettings } from '../../../../../shared/types/settings';

export interface PomodoroFormProps {
  form: UseFormMethods<PomodoroSettings & AutostartSettings>;
}

const formControlProps: Partial<FormControlProps> = {
  width: '450px',
  justifyContent: 'space-between',
  d: 'flex',
  alignItems: 'baseline',
};

export const PomodoroForm: FC<PomodoroFormProps> = ({ form }) => {
  const { errors, control } = form;

  return (
    <Stack spacing={6}>
      <FormControl
        {...formControlProps}
        error={errors.workDurationSeconds?.message}
        label="Work duration"
      >
        <Controller
          name="workDurationSeconds"
          control={control}
          rules={{
            max: 9999,
          }}
          render={(props) => <DurationField {...props} />}
        />
      </FormControl>
      <FormControl
        {...formControlProps}
        error={errors.shortBreakDurationSeconds?.message}
        label="Break duration"
      >
        <Controller
          name="shortBreakDurationSeconds"
          control={control}
          rules={{
            max: 9999,
          }}
          render={(props) => <DurationField {...props} />}
        />
      </FormControl>
      <FormControl
        {...formControlProps}
        error={errors.longBreakDurationSeconds?.message}
        label="Long break duration"
      >
        <Controller
          name="longBreakDurationSeconds"
          control={control}
          rules={{
            max: 9999,
          }}
          render={(props) => <DurationField {...props} />}
        />
      </FormControl>
      <FormControl
        {...formControlProps}
        error={errors.openFullWindowOnBreak?.message}
        name="openFullWindowOnBreak"
        label="Open separate window on break"
      >
        <Controller
          name="openFullWindowOnBreak"
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
        error={errors.autoRunBreak?.message}
        name="autoRunBreak"
        label="Start break automatically"
      >
        <Controller
          name="autoRunBreak"
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
        error={errors.autoRunWork?.message}
        name="autoRunWork"
        label="Start work automatically"
      >
        <Controller
          name="autoRunWork"
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
