import React, { FC, useMemo } from 'react';
import { RecoilRoot } from 'recoil';
import { IpcRendererProvider } from './IpcRendererProvider';
import {
  CSSReset,
  extendTheme,
  theme as chakraTheme,
  ThemeProvider,
} from '@chakra-ui/core';
import { MemoryRouter } from 'react-router-dom';
import History from 'history';
import { PomodoroState } from '../../shared/types';

export interface AppProviderProps {}

const theme = extendTheme({
  colors: {
    brand: {
      [PomodoroState.Work]: chakraTheme.colors.blue['300'],
      [PomodoroState.Break]: chakraTheme.colors.green['300'],
      [PomodoroState.LongBreak]: chakraTheme.colors.green['600'],
      primary: chakraTheme.colors.blue['300'],
      textPrimary: chakraTheme.colors.black,
      textSecondary: chakraTheme.colors.gray['500'],
    },
  },
  config: {
    useSystemColorMode: true,
    initialColorMode: 'light',
  },
});

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
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
        <CSSReset />
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={initialEntries}>
            {children}
          </MemoryRouter>
        </ThemeProvider>
      </IpcRendererProvider>
    </RecoilRoot>
  );
};
