import React, { PropsWithChildren } from 'react';
import { RecoilRoot } from 'recoil';
import { IpcRendererProvider } from './IpcRendererProvider';
import { ModalProvider } from './modalProvider/ModalProvider';
import { DialogProvider } from './dialogProvider/DialogProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from './ThemeProvider';
import { RouterProvider } from './RouterProvider';

export interface AppProviderProps {}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const AppProvider = ({
  children,
}: PropsWithChildren<AppProviderProps>) => {
  return (
    <RecoilRoot>
      <IpcRendererProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ModalProvider>
              <DialogProvider>
                <RouterProvider>{children}</RouterProvider>
              </DialogProvider>
            </ModalProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </IpcRendererProvider>
    </RecoilRoot>
  );
};
