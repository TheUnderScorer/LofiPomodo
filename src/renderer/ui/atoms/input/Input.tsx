import React, { forwardRef } from 'react';
import { ChakraProps } from '@chakra-ui/system';
import {
  Input as BaseInput,
  InputProps as BaseInputProps,
  useStyleConfig,
} from '@chakra-ui/react';

export interface InputProps extends BaseInputProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'nes', ...props }, ref) => {
    const styles = useStyleConfig('Input', { variant }) as ChakraProps;

    return (
      <BaseInput
        bg="inherit"
        w="100%"
        borderRadius={0}
        {...props}
        ref={ref}
        sx={styles}
      />
    );
  }
);
