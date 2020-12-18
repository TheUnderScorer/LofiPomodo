import { Input, InputGroup, InputProps } from '@chakra-ui/core';
import React, { forwardRef } from 'react';
import {
  FormControl,
  FormControlProps,
} from '../../atoms/formControl/FormControl';

export interface CommonFieldProps extends FormControlProps {
  inputProps?: InputProps;
}

export const CommonField = forwardRef<HTMLInputElement, CommonFieldProps>(
  ({ name, inputProps = {}, children, ...rest }, ref) => {
    return (
      <FormControl name={name} {...rest}>
        <InputGroup>
          <Input name={name} ref={ref} {...inputProps} />
          {children}
        </InputGroup>
      </FormControl>
    );
  }
);
