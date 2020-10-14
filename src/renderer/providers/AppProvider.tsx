import React, { FC, useMemo } from 'react';
import { RecoilRoot } from 'recoil';
import { IpcRendererProvider } from './IpcRendererProvider';
import {
  extendTheme,
  ThemeProvider,
  CSSReset,
  ColorModeProvider,
} from '@chakra-ui/core';
import { MemoryRouter } from 'react-router-dom';
import History from 'history';

export interface AppProviderProps {}

const theme = extendTheme({});

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
          <ColorModeProvider options={{}} value="dark">
            <MemoryRouter initialEntries={initialEntries}>
              {children}
            </MemoryRouter>
          </ColorModeProvider>
        </ThemeProvider>
      </IpcRendererProvider>
    </RecoilRoot>
  );
};
