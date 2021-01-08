import { createContext, FC, useContext, useEffect, useMemo } from 'react';
import { useMount, useSet, useUnmount } from 'react-use';
import { Actions } from 'react-use/lib/useSet';

export interface ModalProviderProps {}

export const ModalContext = createContext<
  Actions<string> & { set: Set<string> }
>({} as any);

export interface ModalStateHookParams {
  id: string;
  defaultOpen?: boolean;
  onChange?: (open: boolean) => any;
}

export const useModalState = ({
  id,
  defaultOpen,
  onChange,
}: ModalStateHookParams) => {
  const { has, toggle, add, remove, set } = useContext(ModalContext);

  useMount(() => {
    if (defaultOpen) {
      add(id);
    }
  });

  useUnmount(() => {
    remove(id);
  });

  useEffect(() => {
    if (onChange) {
      onChange(set.has(id));
    }
  }, [id, onChange, set]);

  return useMemo(
    () => ({
      isOpen: () => has(id),
      toggle: () => toggle(id),
      hide: () => remove(id),
      show: () => add(id),
    }),
    [add, has, id, remove, toggle]
  );
};

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
