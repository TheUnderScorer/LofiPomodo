import React from 'react';
import { IconName, iconsMap } from './icons';
import { ChakraProps } from '@chakra-ui/system';

export interface IconProps extends Partial<Omit<ChakraProps, 'name'>> {
  name: IconName;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const Component = iconsMap[name];

  return <Component preserveAspectRatio="xMidYMid meet" {...props} />;
};
