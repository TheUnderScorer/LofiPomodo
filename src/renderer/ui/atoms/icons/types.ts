import { ColorMode } from '../../../../shared/types/color';
import { ReactNode } from 'react';

export interface BaseIconProps {
  width?: number | string;
  height?: number | string;
  variant?: ColorMode;
}

export type ColorIconMap = Record<ColorMode, ReactNode | string>;
