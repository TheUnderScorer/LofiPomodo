import { useMount, useUnmount } from 'react-use';
import { useMemo, useState } from 'react';

interface UseWindowMinSizeOnMountParams {
  minHeight?: number;
  minWidth?: number;
}

export const useWindowMinSizeOnMount = ({
  minHeight = window.innerHeight,
  minWidth = window.innerWidth,
}: UseWindowMinSizeOnMountParams) => {
  const prevHeight = useMemo(() => window.innerHeight, []);
  const prevWidth = useMemo(() => window.innerWidth, []);
  const [didResize, setDidResize] = useState(false);

  useMount(() => {
    if (window.innerHeight < minHeight || window.innerWidth < minWidth) {
      setDidResize(true);

      window.resizeTo(minWidth, minHeight);
    }
  });

  useUnmount(() => {
    if (didResize) {
      window.resizeTo(prevWidth, prevHeight);
    }
  });

  return {
    didResize,
  };
};
