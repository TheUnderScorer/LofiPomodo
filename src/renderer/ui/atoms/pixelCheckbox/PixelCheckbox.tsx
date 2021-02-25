import { Checkbox, CheckboxProps, useStyleConfig } from '@chakra-ui/react';
import React from 'react';
import { Icon } from '../icons/Icon';

export interface PixelCheckboxProps extends CheckboxProps {
  variant?: string;
}

export const PixelCheckbox = (props: PixelCheckboxProps) => {
  const styles = useStyleConfig('Checkbox', props);

  return (
    <Checkbox
      icon={<Icon fill="inherit" boxSize={5} name="PixelCheck" />}
      {...props}
      sx={styles}
    >
      {props.children}
    </Checkbox>
  );
};
