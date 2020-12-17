import { IconButton, IconButtonProps, Tooltip } from '@chakra-ui/core';
import React, { FC, useMemo } from 'react';
import { useIpcInvoke } from '../../../../../shared/ipc/useIpcInvoke';
import { PomodoroEvents } from '../../../../../../shared/types';
import { ArrowIcon } from '../../../../../ui/atoms/icons';
import { usePomodoro } from '../../../hooks/usePomodoro';
import { getNextState } from '../../../../../../main/app/pomodoro/logic/nextState';
import { pomodoroStateDictionary } from '../../../../../../shared/dictionary/pomodoro';

export interface NextStateBtnProps
  extends Omit<IconButtonProps, 'aria-label'> {}

export const NextStateBtn: FC<NextStateBtnProps> = (props) => {
  const { pomodoro } = usePomodoro();

  const nextState = useMemo(() => {
    if (!pomodoro) {
      return '';
    }

    return pomodoroStateDictionary[getNextState(pomodoro)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pomodoro!.state, pomodoro!.shortBreakCount, pomodoro!.longBreakInterval]);

  const [invoke] = useIpcInvoke(PomodoroEvents.MoveToNextState);

  return (
    <Tooltip label={`Skip to ${nextState}`}>
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
