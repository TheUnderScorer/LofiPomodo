import React, { FC, useMemo } from 'react';
import { RecoilRoot } from 'recoil';
import { IpcRendererProvider } from './IpcRendererProvider';
import {
  ColorModeProvider,
  CSSReset,
  extendTheme,
  theme as chakraTheme,
  ThemeProvider,
  useColorModePreference,
} from '@chakra-ui/core';
import { MemoryRouter } from 'react-router-dom';
import History from 'history';
import { PomodoroState } from '../../shared/types';
import { Theme } from '../types/theme';

export interface AppProviderProps {}

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const colorMode = useColorModePreference();

  const theme: Theme = extendTheme({
    colors: {
      brand: {
        [PomodoroState.Work]: chakraTheme.colors.blue['300'],
        [PomodoroState.Break]: chakraTheme.colors.green['300'],
        [PomodoroState.LongBreak]: chakraTheme.colors.green['600'],
        primary: chakraTheme.colors.blue['300'],
        textPrimary:
          colorMode === 'dark'
            ? chakraTheme.colors.white
            : chakraTheme.colors.black,
        textSecondary: chakraTheme.colors.gray['500'],
        iconPrimary:
          colorMode === 'dark'
            ? chakraTheme.colors.gray['400']
            : chakraTheme.colors.gray['700'],
      },
    },
  });

  const initialEntries: History.LocationDescriptor[] = useMemo(() => {
    if (!window.location.search) {
      return [];
    }

    const params = new URLSearchParams(window.location.search);
    const path = params.get('path');

    if (!path) {
      return [];
    }

    return [
      {
        pathname: path,
      },
    ];
  }, []);

  console.log({ colorMode });

  return (
    <RecoilRoot>
      <IpcRendererProvider>
        <CSSReset />
        <ThemeProvider theme={theme}>
          <ColorModeProvider
            options={{
              useSystemColorMode: true,
              initialColorMode: colorMode,
            }}
            value={colorMode}
          >
            <MemoryRouter initialEntries={initialEntries}>
              {children}
            </MemoryRouter>
          </ColorModeProvider>
        </ThemeProvider>
      </IpcRendererProvider>
    </RecoilRoot>
  );
};
