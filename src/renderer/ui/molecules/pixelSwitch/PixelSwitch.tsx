import { HStack } from '@chakra-ui/react';
import React from 'react';
import { PixelRadio, PixelRadioProps } from '../../atoms/pixelRadio/PixelRadio';

export interface PixelSwitchProps
  extends Pick<PixelRadioProps, 'name' | 'isChecked' | 'id'> {
  onChange?: (checked: boolean) => unknown;
}

export const PixelSwitch = ({
  name,
  isChecked,
  onChange,
  id,
}: PixelSwitchProps) => {
  return (
    <HStack spacing={4} id={id}>
      <PixelRadio
        name={`${name}-yes`}
        label="Yes"
        isChecked={isChecked}
        onChange={(event) => {
          onChange?.(event.target.checked);
        }}
      />
      <PixelRadio
        name={`${name}-no`}
        label="No"
        isChecked={!isChecked}
        onChange={(event) => {
          onChange?.(!event.target.checked);
        }}
      />
    </HStack>
  );
};
