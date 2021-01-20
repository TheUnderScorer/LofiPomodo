import React, { FC, useCallback } from 'react';
import { Button, ButtonProps } from '@chakra-ui/core';
import { Text } from '../../../ui/atoms/text/Text';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { AppSystemEvents } from '../../../../shared/types/system';
import { useDialog } from '../../../providers/dialogProvider/hooks/useDialog';
import { unsavedChangesDialog } from '../../../providers/dialogProvider/factories/unsavedChanges';

export interface CloseWindowButtonProps extends Omit<ButtonProps, 'onClick'> {
  isDirty?: boolean;
}

export const CloseWindowButton: FC<CloseWindowButtonProps> = ({
  children,
  isDirty,
  ...props
}) => {
  const { showDialog } = useDialog();
  const [close] = useIpcInvoke<never>(AppSystemEvents.CloseWindow);

  const handleClose = useCallback(() => {
    if (isDirty) {
      showDialog(unsavedChangesDialog(close));

      return;
    }

    close();
  }, [close, isDirty, showDialog]);

  return (
    <Button onClick={handleClose}>
      <Text>{children ?? 'Close'}</Text>
    </Button>
  );
};
