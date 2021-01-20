import React, { FC, useMemo } from 'react';
import { RecoilRoot } from 'recoil';
import { IpcRendererProvider } from './IpcRendererProvider';
import {
  ColorModeProvider,
  CSSReset,
  extendTheme,
  GlobalStyle,
  theme as chakraTheme,
  ThemeProvider,
} from '@chakra-ui/core';
import { MemoryRouter } from 'react-router-dom';
import History from 'history';
import { PomodoroState } from '../../shared/types';
import { Theme } from '../types/theme';
import { usePrefersColorScheme } from '../shared/hooks/usePrefersColorScheme';
import { ModalProvider } from './modalProvider/ModalProvider';
import { DialogProvider } from './dialogProvider/DialogProvider';
import { QueryClient, QueryClientProvider } from 'react-query';

export interface AppProviderProps {}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const colorMode = usePrefersColorScheme();

  const theme: Theme = useMemo(() => {
    const color = colorMode === 'dark' ? '#FFFCFC' : chakraTheme.colors.black;
    return extendTheme({
      colors: {
        brand: {
          [PomodoroState.Work]: chakraTheme.colors.blue['300'],
          [PomodoroState.Break]: chakraTheme.colors.green['300'],
          [PomodoroState.LongBreak]: chakraTheme.colors.green['600'],
          paper: '#eee6e6',
          success: chakraTheme.colors.green['500'],
          primary: chakraTheme.colors.blue['300'],
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

  return (
    <RecoilRoot>
      <IpcRendererProvider>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <ModalProvider>
              <GlobalStyle />
              <ColorModeProvider
                options={{
                  initialColorMode: colorMode,
                }}
                value={colorMode}
              >
                <CSSReset />
                <DialogProvider>
                  <MemoryRouter initialEntries={initialEntries}>
                    {children}
                  </MemoryRouter>
                </DialogProvider>
              </ColorModeProvider>
            </ModalProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </IpcRendererProvider>
    </RecoilRoot>
  );
};
