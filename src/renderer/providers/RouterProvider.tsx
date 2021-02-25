import React, { PropsWithChildren, useMemo } from 'react';
import History from 'history';
import { MemoryRouter } from 'react-router-dom';

export interface RouterProviderProps {}

export const RouterProvider = ({
  children,
}: PropsWithChildren<RouterProviderProps>) => {
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
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
};
