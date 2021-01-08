import React, { FC } from 'react';
import { TimerBox } from '../../components/timerBox/TimerBox';
import { usePomodoro } from '../../hooks/usePomodoro';
import { CenterContainer } from '../../../../ui/templates/centerContainer/CenterContainer';
import { usePomodoroListeners } from '../../hooks/usePomodoroListeners';
import { useTasksListeners } from '../../../tasks/hooks/useTaskListeners';

export interface BreakViewProps {}

export const BreakView: FC<BreakViewProps> = () => {
  usePomodoroListeners();
  useTasksListeners();

  const { pomodoro } = usePomodoro();

  return (
    <CenterContainer id="break_view">
      {pomodoro && (
        <TimerBox
          stackProps={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          containerProps={{
            w: '100%',
            h: '100%',
          }}
        />
      )}
    </CenterContainer>
  );
};
