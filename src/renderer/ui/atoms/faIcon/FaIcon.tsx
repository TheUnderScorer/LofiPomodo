import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import React, { FC, useMemo } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { BrandColors, Theme, ThemeColors } from '../../../types/theme';
import { useTheme } from '@chakra-ui/core';

export interface FaIconProps extends FontAwesomeIconProps {
  icon: IconProp;
  color?: keyof BrandColors | keyof ThemeColors;
}

export const FaIcon: FC<FaIconProps> = ({
  icon,
  color = 'iconPrimary',
  ...props
}) => {
  const theme = useTheme() as Theme;
  const iconColor = useMemo(() => {
    if (
      theme?.colors?.brand &&
      theme.colors.brand[color as keyof BrandColors]
    ) {
      return theme.colors.brand[color as keyof BrandColors];
    }

    if (theme?.colors && theme.colors[color as keyof ThemeColors]) {
      const themeColor = theme.colors[color as keyof ThemeColors];

      if (typeof themeColor === 'string') {
        return themeColor;
      }

      return (themeColor as Record<string, string>)['500'];
    }
  }, [theme, color]);

  return <FontAwesomeIcon color={iconColor} icon={icon} {...props} />;
};
