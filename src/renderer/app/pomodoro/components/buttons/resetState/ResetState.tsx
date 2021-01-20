import { IconButton } from '@chakra-ui/core';
import React, { FC } from 'react';
import { useIpcMutation } from '../../../../../shared/ipc/useIpcMutation';
import { PomodoroEvents } from '../../../../../../shared/types';
import {
  RetryIcon,
  RetryIconProps,
} from '../../../../../ui/atoms/icons/RetryIcon';

export interface ResetStateProps {
  iconProps?: RetryIconProps;
}

export const ResetState: FC<ResetStateProps> = ({ iconProps }) => {
  const restartStateMutation = useIpcMutation<void>(
    PomodoroEvents.RestartCurrentState
  );

  return (
    <IconButton
      onClick={() => restartStateMutation.mutate()}
      variant="outline"
      aria-label="Restart current state"
    >
      <RetryIcon width="20px" height="20px" {...iconProps} />
    </IconButton>
  );
};
