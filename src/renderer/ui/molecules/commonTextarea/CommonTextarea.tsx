import { Textarea, TextareaProps } from '@chakra-ui/react';
import React, { forwardRef } from 'react';
import { FormControl, FormControlProps } from '../formControl/FormControl';

export interface CommonTextareaProps extends FormControlProps {
  textAreaProps?: TextareaProps;
}

export const CommonTextarea = forwardRef<
  HTMLTextAreaElement,
  CommonTextareaProps
>(({ name, textAreaProps = {}, ...rest }, ref) => {
  return (
    <FormControl name={name} {...rest}>
      <Textarea name={name} ref={ref} {...textAreaProps} />
    </FormControl>
  );
});
