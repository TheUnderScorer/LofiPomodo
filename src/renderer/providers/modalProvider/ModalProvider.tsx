import { createContext, FC, useMemo } from 'react';
import { useSet } from 'react-use';
import { Actions } from 'react-use/lib/useSet';

export interface ModalProviderProps {}

export const ModalContext = createContext<
  Actions<string> & { set: Set<string> }
>({} as any);

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const [set, state] = useSet<string>();

  const value = useMemo(
    () => ({
      set,
      ...state,
    }),
    [set, state]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
