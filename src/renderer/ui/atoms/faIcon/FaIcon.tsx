import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { chakra, ChakraProps } from '@chakra-ui/system';

export interface FaIconProps
  extends Pick<FontAwesomeIconProps, 'icon'>,
    ChakraProps {
  icon: IconProp;
  className?: string;
}

const ChakraFaIcon = chakra(FontAwesomeIcon);

export const FaIcon: FC<FaIconProps> = ({
  icon,
  color = 'iconPrimary',
  ...props
}) => {
  return <ChakraFaIcon color={color} icon={icon} {...props} />;
};
