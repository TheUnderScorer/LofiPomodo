import React, { useMemo } from 'react';
import { FormControl, FormControlProps } from '../formControl/FormControl';
import { Controller, ControllerProps, UseFormMethods } from 'react-hook-form';
import { get } from 'lodash';

export interface FormControllerProps
  extends Omit<FormControlProps, 'name'>,
    Pick<ControllerProps<any>, 'rules'> {
  children: ControllerProps<any>['render'];
  form: UseFormMethods<any>;
  defaultValue?: any;
  name: string;
}

export const FormController = ({
  children,
  defaultValue,
  form,
  rules,
  ...rest
}: FormControllerProps) => {
  const error = useMemo(
    () => get(form.errors, [...rest.name!.split('.'), 'message']),
    [form.errors, rest.name]
  );

  return (
    <FormControl {...rest} error={rest.error ?? error}>
      <Controller
        name={rest.name!}
        control={form.control}
        defaultValue={defaultValue}
        rules={rules}
        render={(props, state) => children!(props, state)}
      />
    </FormControl>
  );
};
