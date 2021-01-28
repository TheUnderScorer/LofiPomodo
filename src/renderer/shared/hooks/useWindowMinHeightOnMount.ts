import { useMount, useUnmount } from 'react-use';
import { useMemo, useState } from 'react';

export const useWindowMinHeightOnMount = (minHeight: number) => {
  const prevHeight = useMemo(() => window.innerHeight, []);
  const [didResize, setDidResize] = useState(false);

  useMount(() => {
    if (window.innerHeight < minHeight) {
      setDidResize(true);

      window.resizeTo(window.innerWidth, minHeight);
    }
  });

  useUnmount(() => {
    if (didResize) {
      window.resizeTo(window.innerWidth, prevHeight);
    }
  });
};
