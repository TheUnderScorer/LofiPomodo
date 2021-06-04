import { ChakraTheme, Colors, theme } from '@chakra-ui/react';
import { PomodoroStates } from '../../shared/types';

type Shadows = typeof theme.shadows;

export type BrandColors = Record<PomodoroStates, string> & {
  primary: Colors['blue'];
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

export interface ThemeShadows extends Shadows {
  focus: string;
  active: string;
  hover: string;
  selected: string;

  [key: string]: any;
}

export interface Theme extends ChakraTheme {
  colors: ThemeColors;
  shadows: ThemeShadows;
}
