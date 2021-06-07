import { Menu, MenuList, Portal } from '@chakra-ui/react';
import React, {
  FC,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { atom, useRecoilState } from 'recoil';
import clone from 'lodash.clonedeep';
import { useMount } from 'react-use';
import { usePopper } from 'react-popper';
import './ContextMenu.styles.css';
import { findScrollContainer } from '../../../shared/findScrollContainer';
import { useScrollLock } from '../../../shared/hooks/useScrollLock';

export interface ContextMenuBag {
  onContextMenu: (event: any) => any;
  open: boolean;
}

export interface ContextMenuProps {
  menu: ReactNode;
  children: (bag: ContextMenuBag) => ReactNode;
  id: string;
}

const contextMenus = atom<Record<string, boolean>>({
  default: {},
  key: 'contextMenu',
});

export const ContextMenu: FC<ContextMenuProps> = ({ menu, children, id }) => {
  const [menus, setMenus] = useRecoilState(contextMenus);

  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  const open = useMemo(() => {
    return Boolean(menus[id]);
  }, [id, menus]);

  const toggleOpen = useCallback(() => {
    const newMenus = clone(menus);
    newMenus[id] = !newMenus[id];

    setMenus(newMenus);
  }, [id, menus, setMenus]);

  const { styles, attributes } = usePopper(container, popperElement, {
    placement: 'auto',
    strategy: 'absolute',
  });

  const toggleMenu: MouseEventHandler<HTMLElement> = useCallback(
    (event) => {
      event.stopPropagation();

      setContainer(event.target as HTMLElement);
      setScrollElement(findScrollContainer(event.target as HTMLElement));

      setMenus((prev) => {
        const entries = Object.entries(prev).map(([key, value]) => [
          key,
          key === id ? !value : false,
        ]);

        return Object.fromEntries(entries);
      });
    },
    [setMenus, id]
  );

  useScrollLock(open, scrollElement);

  useMount(() => {
    setMenus((prev) => {
      const value = { ...prev };

      value[id] = false;

      return value;
    });
  });

  useEffect(() => {
    console.log({
      container,
      styles,
    });
  }, [container, styles]);

  return (
    <>
      {open && (
        <Portal>
          <div
            ref={setPopperElement}
            style={styles.popper}
            className="context-menu"
            {...attributes.popper}
          >
            <Menu
              closeOnSelect={false}
              placement="auto"
              strategy="absolute"
              preventOverflow
              isLazy
              isOpen={open}
              onClose={() => toggleOpen()}
            >
              <MenuList>{menu}</MenuList>
            </Menu>
          </div>
        </Portal>
      )}
      {children({ onContextMenu: toggleMenu, open })}
    </>
  );
};
