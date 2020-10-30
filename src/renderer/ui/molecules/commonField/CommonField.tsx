import { Input, InputProps } from '@chakra-ui/core';
import React, { FC, forwardRef } from 'react';
import {
  FormControl,
  FormControlProps,
} from '../../atoms/formControl/FormControl';

export interface CommonFieldProps extends FormControlProps {
  inputProps?: InputProps;
}

export const CommonField = forwardRef<HTMLInputElement, CommonFieldProps>(
  ({ name, inputProps = {}, ...rest }, ref) => {
    return (
      <FormControl name={name} {...rest}>
        <Input name={name} ref={ref} {...inputProps} />
      </FormControl>
    );
  }
);
