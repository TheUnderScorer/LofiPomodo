import { useCallback, useState } from 'react';
import { Nullable } from '../../../shared/types';
import { useUnmount } from 'react-use';

export const useScheduler = (callback: () => any) => {
  const [timeoutId, setTimeoutId] = useState<Nullable<NodeJS.Timeout>>();

  const schedule = useCallback(
    (ms: number) => {
      setTimeoutId(setTimeout(callback, ms));
    },
    [callback]
  );

  const cancel = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }, [timeoutId]);

  useUnmount(() => {
    cancel();
  });

  return {
    schedule,
    cancel,
  };
};
