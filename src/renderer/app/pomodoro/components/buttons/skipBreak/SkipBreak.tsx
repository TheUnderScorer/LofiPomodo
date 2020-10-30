import { IconButton } from '@chakra-ui/core';
import React, { FC } from 'react';
import { FaIcon } from '../../../../../ui/atoms/faIcon/FaIcon';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useIpcInvoke } from '../../../../../shared/ipc/useIpcInvoke';
import { PomodoroEvents } from '../../../../../../shared/types';

export interface SkipBreakProps {}

export const SkipBreak: FC<SkipBreakProps> = () => {
  const [invoke] = useIpcInvoke(PomodoroEvents.SkipBreak);

  return (
    <IconButton
      className="skip-break"
      onClick={() => invoke()}
      isRound
      aria-label="Skip break"
      variant="link"
    >
      <FaIcon icon={faArrowRight} />
    </IconButton>
  );
};
