import { MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { useScheduler } from './useScheduler';

interface InlineConfirmHookProps {
  onClick: MouseEventHandler;
  actionText: string;
  confirmText: string;
}

export const useInlineConfirm = ({
  actionText,
  confirmText,
  onClick,
}: InlineConfirmHookProps) => {
  const [isConfirm, setIsConfirm] = useState(false);

  const text = useMemo(() => (isConfirm ? confirmText : actionText), [
    actionText,
    confirmText,
    isConfirm,
  ]);

  const cancelConfirmation = useCallback(() => {
    setIsConfirm(false);
  }, []);

  const { schedule: scheduleCancel } = useScheduler(cancelConfirmation);

  const handleClick: MouseEventHandler = useCallback(
    async (event) => {
      if (!isConfirm) {
        setIsConfirm(true);

        scheduleCancel(4000);

        return;
      }

      await onClick(event);
      setIsConfirm(false);
    },
    [isConfirm, onClick, scheduleCancel]
  );

  return {
    isConfirm,
    text,
    handleClick,
    cancelConfirmation,
  };
};
