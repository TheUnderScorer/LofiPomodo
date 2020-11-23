import { IconButton } from '@chakra-ui/core';
import React, { FC } from 'react';
import { useIpcInvoke } from '../../../../../shared/ipc/useIpcInvoke';
import { PomodoroEvents } from '../../../../../../shared/types';
import {
  RetryIcon,
  RetryIconProps,
} from '../../../../../ui/atoms/icons/RetryIcon';

export interface ResetStateProps {
  iconProps?: RetryIconProps;
}

export const ResetState: FC<ResetStateProps> = ({ iconProps }) => {
  const [invoke] = useIpcInvoke(PomodoroEvents.RestartCurrentState);

  return (
    <IconButton
      onClick={() => invoke()}
      variant="outline"
      aria-label="Restart current state"
    >
      <RetryIcon width="20px" height="20px" {...iconProps} />
    </IconButton>
  );
};
