import React, { FC } from 'react';
import { Controller, UseFormMethods } from 'react-hook-form';
import {
  FormControl,
  FormControlProps,
} from '../../../../ui/atoms/formControl/FormControl';
import { DurationField } from '../../../../form/fields/DurationField';
import { Divider, Stack, Switch } from '@chakra-ui/core';
import { AppSettings } from '../../../../../shared/types/settings';

export interface PomodoroFormProps {
  form: UseFormMethods<AppSettings>;
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
        error={errors.pomodoro?.workDurationSeconds?.message}
        label="Work duration"
      >
        <Controller
          name="pomodoro.workDurationSeconds"
          control={control}
          rules={{
            max: 9999,
          }}
          render={(props) => <DurationField {...props} />}
        />
      </FormControl>
      <FormControl
        {...formControlProps}
        error={errors.pomodoro?.shortBreakDurationSeconds?.message}
        label="Break duration"
      >
        <Controller
          name="pomodoro.shortBreakDurationSeconds"
          control={control}
          rules={{
            max: 9999,
          }}
          render={(props) => <DurationField {...props} />}
        />
      </FormControl>
      <FormControl
        {...formControlProps}
        error={errors.pomodoro?.longBreakDurationSeconds?.message}
        label="Long break duration"
      >
        <Controller
          name="pomodoro.longBreakDurationSeconds"
          control={control}
          rules={{
            max: 9999,
          }}
          render={(props) => <DurationField {...props} />}
        />
      </FormControl>
      <FormControl
        {...formControlProps}
        error={errors.pomodoro?.openFullWindowOnBreak?.message}
        name="pomodoro.openFullWindowOnBreak"
        label="Open separate window on break"
      >
        <Controller
          name="pomodoro.openFullWindowOnBreak"
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
        error={errors.pomodoro?.autoRunBreak?.message}
        name="pomodoro.autoRunBreak"
        label="Start break automatically"
      >
        <Controller
          name="pomodoro.autoRunBreak"
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
        error={errors.pomodoro?.autoRunWork?.message}
        name="pomodoro.autoRunWork"
        label="Start work automatically"
      >
        <Controller
          name="pomodoro.autoRunWork"
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
