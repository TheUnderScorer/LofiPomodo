import React from 'react';
import { IconName, iconsMap } from './icons';
import { ChakraProps } from '@chakra-ui/system';
import { Box } from '@chakra-ui/react';

export interface IconProps extends Partial<Omit<ChakraProps, 'name'>> {
  name: IconName;
  className?: string;
}

export const Icon = ({ name, className, ...props }: IconProps) => {
  const Component = iconsMap[name];

  return (
    <Box as="span" className={className}>
      <Component
        preserveAspectRatio="xMidYMid meet"
        {...props}
        fill={props.fill ?? 'brand.iconPrimary'}
      />
    </Box>
  );
};
