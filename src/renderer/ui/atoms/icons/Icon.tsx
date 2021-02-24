import React from 'react';
import { IconName, iconsMap } from './icons';
import { chakra, ChakraProps } from '@chakra-ui/system';

export interface IconProps extends Omit<ChakraProps, 'name'> {
  name: IconName;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const Component = chakra(iconsMap[name]);

  return <Component preserveAspectRatio="xMidYMid meet" {...props} />;
};
