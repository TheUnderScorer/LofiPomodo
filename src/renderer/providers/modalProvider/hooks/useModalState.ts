import { useContext, useEffect, useMemo } from 'react';
import { useMount, useUnmount } from 'react-use';
import { ModalContext } from '../ModalProvider';

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
