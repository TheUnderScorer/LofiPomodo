import { IconButton, IconButtonProps, Tooltip } from '@chakra-ui/core';
import React, { FC } from 'react';
import { useIpcInvoke } from '../../../../../shared/ipc/useIpcInvoke';
import { PomodoroEvents } from '../../../../../../shared/types';
import { ArrowIcon } from '../../../../../ui/atoms/icons';

export interface NextStateBtnProps
  extends Omit<IconButtonProps, 'aria-label'> {}

export const NextStateBtn: FC<NextStateBtnProps> = (props) => {
  const [invoke] = useIpcInvoke(PomodoroEvents.MoveToNextState);

  return (
    <Tooltip label="Move to next state">
      <IconButton
        className="move-to-next-state"
        onClick={() => invoke()}
        aria-label="Move to next state"
        {...props}
      >
        <ArrowIcon
          variant="dark"
          width="auto"
          height="20px"
          iconDirection="left"
        />
      </IconButton>
    </Tooltip>
  );
};
