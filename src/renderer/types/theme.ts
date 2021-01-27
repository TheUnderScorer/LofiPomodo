import { Theme as BaseTheme, theme } from '@chakra-ui/core';
import { PomodoroStateEnum } from '../../shared/types';

type Colors = typeof theme.colors;

export type BrandColors = Record<PomodoroStateEnum, string> & {
  primary: string;
  textPrimary: string;
  textSecondary: string;
  iconPrimary: string;
  colorModeContrast: string;
  danger: string;
  success: string;
};

export interface ThemeColors extends Colors {
  brand: BrandColors;
}

export interface Theme extends BaseTheme {
  colors: ThemeColors;
}
