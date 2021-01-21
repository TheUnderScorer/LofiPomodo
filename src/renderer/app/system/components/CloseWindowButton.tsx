import React, { FC, useCallback } from 'react';
import { Button, ButtonProps } from '@chakra-ui/core';
import { Text } from '../../../ui/atoms/text/Text';
import { useIpcMutation } from '../../../shared/ipc/useIpcMutation';
import { AppSystemOperations } from '../../../../shared/types/system';
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
  const closeMutation = useIpcMutation<void>(AppSystemOperations.CloseWindow);

  const handleClose = useCallback(() => {
    if (isDirty) {
      showDialog(unsavedChangesDialog(closeMutation.mutateAsync));

      return;
    }

    closeMutation.mutate();
  }, [closeMutation, isDirty, showDialog]);

  return (
    <Button onClick={handleClose} {...props}>
      <Text>{children ?? 'Close'}</Text>
    </Button>
  );
};
