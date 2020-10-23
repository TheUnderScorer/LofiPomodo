import React, { FC, MouseEventHandler, useCallback } from 'react';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@chakra-ui/core';
import { FaIcon } from '../../../../ui/atoms/faIcon/FaIcon';
import { useIpcRenderer } from '../../../../providers/IpcRendererProvider';
import { PomodoroEvents, ToggleMenuPayload } from '../../../../../shared/types';

export interface PomodoroMenuProps {}

export const PomodoroMenu: FC<PomodoroMenuProps> = () => {
  const ipc = useIpcRenderer();

  const handleClick: MouseEventHandler<HTMLElement> = useCallback(
    async (event) => {
      const rect = event.currentTarget.getBoundingClientRect();

      await ipc.invoke<ToggleMenuPayload>(PomodoroEvents.ToggleTimerMenu, {
        x: rect.x,
        y: rect.y + event.currentTarget.clientHeight,
      });
    },
    [ipc]
  );

  return (
    <IconButton variant="ghost" onClick={handleClick} aria-label="Toggle menu">
      <FaIcon icon={faEllipsisV} />
    </IconButton>
  );
};
