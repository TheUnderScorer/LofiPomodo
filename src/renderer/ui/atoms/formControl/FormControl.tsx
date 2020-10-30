import React, { FC } from 'react';
import {
  FormControl as BaseFormControl,
  FormControlProps as BaseFormControlProps,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/core';

export interface FormControlProps extends BaseFormControlProps {
  label?: string;
  helperText?: string;
  name?: string;
  error?: string;
}

export const FormControl: FC<FormControlProps> = ({
  label,
  helperText,
  name,
  error,
  children,
  ...rest
}) => {
  return (
    <BaseFormControl isInvalid={Boolean(error)} id={name} {...rest}>
      {label && <FormLabel>{label}</FormLabel>}
      {children}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </BaseFormControl>
  );
};
