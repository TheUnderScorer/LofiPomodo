import { Theme } from '../../types/theme';
import { ColorMode } from '../../../shared/types/color';
import { ComponentType, FC, useMemo } from 'react';
import { ThemeProvider, useColorMode, useTheme } from '@chakra-ui/react';
import * as React from 'react';

type ExtendsThemeCallback = (theme: Theme, colorMode: ColorMode) => Theme;

export const extendsTheme = <Props extends Record<string, any>>(
  callback: ExtendsThemeCallback
) => (Component: ComponentType<Props>): FC<Props> => (props) => {
  const theme = useTheme() as Theme;
  const { colorMode } = useColorMode();

  const themeToUse = useMemo(() => {
    return callback(theme, colorMode);
  }, [colorMode, theme]);

  return (
    <ThemeProvider theme={themeToUse}>
      <Component {...props} />
    </ThemeProvider>
  );
};
