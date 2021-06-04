import React from 'react';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
} from '@chakra-ui/react';
import { Icon } from '../../atoms/icons/Icon';

const sizeProps = {
  width: '13px !important',
  height: '13px !important',
};

export const NumberStepper = () => {
  return (
    <NumberInputStepper>
      <NumberIncrementStepper>
        <Icon name="Arrow" transform="rotate(-90deg)" {...sizeProps} />
      </NumberIncrementStepper>
      <NumberDecrementStepper>
        <Icon name="Arrow" transform="rotate(90deg)" {...sizeProps} />
      </NumberDecrementStepper>
    </NumberInputStepper>
  );
};
