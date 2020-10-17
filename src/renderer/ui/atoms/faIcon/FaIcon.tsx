import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { BrandColors, Theme } from '../../../types/theme';
import { useTheme } from '@chakra-ui/core';

export interface FaIconProps {
  icon: IconProp;
  color?: keyof BrandColors;
}

export const FaIcon: FC<FaIconProps> = ({ icon, color = 'iconPrimary' }) => {
  const theme = useTheme() as Theme;

  return <FontAwesomeIcon color={theme.colors.brand[color]} icon={icon} />;
};
