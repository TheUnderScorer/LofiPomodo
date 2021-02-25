import React, { PropsWithChildren, useMemo } from 'react';
import { usePrefersColorScheme } from '../shared/hooks/usePrefersColorScheme';
import { Theme } from '../types/theme';
import { theme as chakraTheme } from '@chakra-ui/theme';
import {
  ChakraProvider,
  ColorModeProvider,
  extendTheme,
} from '@chakra-ui/react';
import { PomodoroStates } from '../../shared/types';

export interface ThemeProviderProps {}

export const ThemeProvider = ({
  children,
}: PropsWithChildren<ThemeProviderProps>) => {
  const colorMode = usePrefersColorScheme();

  const theme: Theme = useMemo(() => {
    const color =
      colorMode === 'dark'
        ? chakraTheme.colors.white
        : chakraTheme.colors.black;
    return extendTheme({
      colors: {
        brand: {
          [PomodoroStates.Work]: chakraTheme.colors.blue['300'],
          [PomodoroStates.Break]: chakraTheme.colors.green['300'],
          [PomodoroStates.LongBreak]: chakraTheme.colors.green['600'],
          paper: '#eee6e6',
          success: chakraTheme.colors.green['500'],
          primary: chakraTheme.colors.blue,
          colorModeContrast:
            colorMode === 'dark' ? '#FFFCFC' : chakraTheme.colors.white,
          textPrimary: color,
          textSecondary: chakraTheme.colors.gray['500'],
          iconPrimary: color,
          danger: '#FC8181',
        },
      },
      config: {
        initialColorMode: colorMode,
      },
      fonts: {
        body: 'PixelFont',
        heading: 'PixelFont',
        mono: 'PixelFont',
      },
      components: {
        Checkbox: {
          defaultProps: {
            colorScheme: 'brand.primary',
          },
        },
      },
      styles: {
        global: {
          body: {
            fontFamily: 'PixelFont',
            overflow: 'visible',
          },
          'div.chakra-checkbox__control': {
            borderColor: color,
          },
          'html body input': {
            color,
          },
        },
      },
    });
  }, [colorMode]);

  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{ initialColorMode: colorMode, useSystemColorMode: true }}
      >
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  );
};
