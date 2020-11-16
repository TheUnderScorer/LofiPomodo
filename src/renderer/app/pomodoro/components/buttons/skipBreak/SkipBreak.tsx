import { IconButton, IconButtonProps, Tooltip } from '@chakra-ui/core';
import React, { FC } from 'react';
import { useIpcInvoke } from '../../../../../shared/ipc/useIpcInvoke';
import { PomodoroEvents } from '../../../../../../shared/types';
import { ArrowIcon } from '../../../../../ui/atoms/icons';

export interface SkipBreakProps extends Omit<IconButtonProps, 'aria-label'> {}

export const SkipBreak: FC<SkipBreakProps> = (props) => {
  const [invoke] = useIpcInvoke(PomodoroEvents.SkipBreak);

  return (
    <Tooltip label="Skip break">
      <IconButton
        className="skip-break"
        onClick={() => invoke()}
        aria-label="Skip break"
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
