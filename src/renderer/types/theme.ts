import { Theme as BaseTheme, theme } from '@chakra-ui/core';
import { PomodoroState } from '../../shared/types';

type Colors = typeof theme.colors;

export type BrandColors = Record<PomodoroState, string> & {
  primary: string;
  textPrimary: string;
  textSecondary: string;
  iconPrimary: string;
  colorModeContrast: string;
};

export interface ThemeColors extends Colors {
  brand: BrandColors;
}

export interface Theme extends BaseTheme {
  colors: ThemeColors;
}
