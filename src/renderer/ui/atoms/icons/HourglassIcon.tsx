import React from 'react';
import { BaseIconProps } from './types';
import { composeIcon } from './composeIcon';
import HourglassBlack from '../../../../assets/hourglass-black.png';
import HourglassWhite from '../../../../assets/hourglass-white.png';

export interface HourglassIconProps extends BaseIconProps {}

export const HourglassIcon = composeIcon<HourglassIconProps>({
  type: 'img',
  iconMap: {
    light: HourglassBlack,
    dark: HourglassWhite,
  },
  alt: 'Hourglass',
});
