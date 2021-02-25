import React, { FC, useMemo } from 'react';
import { RecoilRoot } from 'recoil';
import { IpcRendererProvider } from './IpcRendererProvider';
import {
  ChakraProvider,
  ColorModeProvider,
  extendTheme,
  theme as chakraTheme,
} from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import History from 'history';
import { PomodoroStates } from '../../shared/types';
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
        <ChakraProvider resetCSS theme={theme}>
          <ColorModeProvider
            options={{ initialColorMode: colorMode, useSystemColorMode: true }}
          >
            <QueryClientProvider client={queryClient}>
              <ModalProvider>
                <DialogProvider>
                  <MemoryRouter initialEntries={initialEntries}>
                    {children}
                  </MemoryRouter>
                </DialogProvider>
              </ModalProvider>
            </QueryClientProvider>
          </ColorModeProvider>
        </ChakraProvider>
      </IpcRendererProvider>
    </RecoilRoot>
  );
};
