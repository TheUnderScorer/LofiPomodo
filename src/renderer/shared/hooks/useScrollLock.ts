import { useEffect, useRef } from 'react';

export const useScrollLock = (lock?: boolean, element?: HTMLElement | null) => {
  const prevOverflow = useRef(
    element ? getComputedStyle(element)?.overflow : null
  );

  useEffect(() => {
    if (!element) {
      return;
    }

    if (lock) {
      prevOverflow.current = getComputedStyle(element).overflow;

      element.style.overflow = 'hidden';

      return;
    }

    element.style.overflow = prevOverflow.current ?? '';

    prevOverflow.current = null;
  }, [element, lock]);
};
