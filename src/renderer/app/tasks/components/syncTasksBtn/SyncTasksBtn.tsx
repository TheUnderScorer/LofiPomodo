import React, { FC, useEffect } from 'react';
import { IconButton, IconButtonProps } from '@chakra-ui/core';
import { useTasksSync } from '../../hooks/useTasksSync';
import { useDialog } from '../../../../providers/dialogProvider/hooks/useDialog';
import { errorDialog } from '../../../../providers/dialogProvider/factories/errorDialog';
import { FaIcon } from '../../../../ui/atoms/faIcon/FaIcon';
import { faSync } from '@fortawesome/free-solid-svg-icons';

export interface SyncTasksBtnProps
  extends Omit<IconButtonProps, 'aria-label' | 'onClick' | 'isLoading'> {}

export const SyncTasksBtn: FC<SyncTasksBtnProps> = (props) => {
  const { isSyncing, sync, error } = useTasksSync();

  const { showDialog } = useDialog();

  useEffect(() => {
    if (error) {
      showDialog(errorDialog(error));
    }
  }, [error, showDialog]);

  return (
    <IconButton
      onClick={() => sync()}
      isLoading={isSyncing}
      aria-label="Sync tasks with external apis"
      {...props}
    >
      <FaIcon icon={faSync} />
    </IconButton>
  );
};
