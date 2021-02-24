import { IconButton, IconButtonProps, Tooltip } from '@chakra-ui/react';
import React, { FC, useMemo } from 'react';
import { useIpcMutation } from '../../../../../shared/ipc/useIpcMutation';
import {
  OmitUnderscored,
  PomodoroOperations,
} from '../../../../../../shared/types';
import { ArrowIcon } from '../../../../../ui/atoms/icons';
import { usePomodoro } from '../../../hooks/usePomodoro';
import { getNextState } from '../../../../../../main/app/pomodoro/logic/nextState';
import { pomodoroStateDictionary } from '../../../../../../shared/dictionary/pomodoro';
import { useGetSetting } from '../../../../settings/hooks/useGetSetting';

export interface NextStateBtnProps
  extends Omit<OmitUnderscored<IconButtonProps>, 'aria-label'> {}

export const NextStateBtn: FC<NextStateBtnProps> = (props) => {
  const { pomodoro } = usePomodoro();
  const { data: pomodoroSettings } = useGetSetting('pomodoroSettings');

  const nextState = useMemo(() => {
    if (!pomodoro || !pomodoroSettings) {
      return '';
    }

    return pomodoroStateDictionary[getNextState(pomodoro, pomodoroSettings)];
  }, [pomodoro, pomodoroSettings]);

  const moveToNextStateMutation = useIpcMutation<void>(
    PomodoroOperations.MoveToNextState
  );

  return (
    <Tooltip label={`Skip to ${nextState}`}>
      <IconButton
        className="move-to-next-state"
        onClick={() => moveToNextStateMutation.mutate()}
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
