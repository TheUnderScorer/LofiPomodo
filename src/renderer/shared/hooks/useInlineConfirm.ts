import { MouseEventHandler, useCallback, useMemo, useState } from 'react';

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

  const handleClick: MouseEventHandler = useCallback(
    async (event) => {
      if (!isConfirm) {
        setIsConfirm(true);

        return;
      }

      await onClick(event);
      setIsConfirm(false);
    },
    [isConfirm, onClick]
  );

  return {
    isConfirm,
    text,
    handleClick,
  };
};
