import React from 'react';
import {
  FormController,
  FormControllerProps,
} from '../formController/FormController';

export interface SettingsFormControllerProps extends FormControllerProps {}

export const SettingsFormController = ({
  children,
  ...props
}: SettingsFormControllerProps) => {
  return (
    <FormController
      {...props}
      minWidth="450px"
      justifyContent="space-between"
      d="flex"
      alignItems="baseline"
      flexWrap="wrap"
    >
      {children}
    </FormController>
  );
};
