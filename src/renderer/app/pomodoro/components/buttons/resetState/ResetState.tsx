import { IconButton } from '@chakra-ui/core';
import React, { FC } from 'react';
import { FaIcon } from '../../../../../ui/atoms/faIcon/FaIcon';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { useIpcInvoke } from '../../../../../shared/ipc/useIpcInvoke';
import { PomodoroEvents } from '../../../../../../shared/types';

export interface ResetStateProps {}

export const ResetState: FC<ResetStateProps> = () => {
  const [invoke] = useIpcInvoke(PomodoroEvents.RestartCurrentState);

  return (
    <IconButton
      onClick={() => invoke()}
      variant="ghost"
      aria-label="Restart current state"
    >
      <FaIcon icon={faRedo} />
    </IconButton>
  );
};
