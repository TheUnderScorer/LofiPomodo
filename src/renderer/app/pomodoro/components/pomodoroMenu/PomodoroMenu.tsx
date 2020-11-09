import React, { FC, MouseEventHandler, useCallback } from 'react';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { IconButton, Stack } from '@chakra-ui/core';
import { FaIcon } from '../../../../ui/atoms/faIcon/FaIcon';
import { PomodoroEvents, ToggleMenuPayload } from '../../../../../shared/types';
import { useIpcInvoke } from '../../../../shared/ipc/useIpcInvoke';

export interface PomodoroMenuProps {}

export const PomodoroMenu: FC<PomodoroMenuProps> = () => {
  const [invoke, { loading }] = useIpcInvoke<ToggleMenuPayload>(
    PomodoroEvents.ToggleTimerMenu
  );

  const handleClick: MouseEventHandler<HTMLElement> = useCallback(
    async (event) => {
      const rect = event.currentTarget.getBoundingClientRect();

      await invoke({
        x: rect.x,
        y: rect.y + event.currentTarget.clientHeight,
      });
    },
    [invoke]
  );

  return (
    <Stack direction="row">
      <IconButton
        isLoading={loading}
        variant="ghost"
        onClick={handleClick}
        aria-label="Toggle menu"
      >
        <FaIcon icon={faEllipsisV} />
      </IconButton>
    </Stack>
  );
};
