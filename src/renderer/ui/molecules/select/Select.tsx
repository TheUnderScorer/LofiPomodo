import React, { forwardRef } from 'react';
import { SelectProps, Select as BaseSelect } from '@chakra-ui/react';
import { Icon } from '../../atoms/icons/Icon';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (props: SelectProps, ref) => {
    return (
      <BaseSelect
        ref={ref}
        {...props}
        icon={
          props.icon ?? (
            <Icon
              transform="rotate(90deg)"
              name="Arrow"
              width="15px !important"
              height="15px !important"
            />
          )
        }
      />
    );
  }
);
