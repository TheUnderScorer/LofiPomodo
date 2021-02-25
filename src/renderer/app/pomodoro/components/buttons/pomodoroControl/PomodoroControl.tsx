import { Button, ButtonProps } from '@chakra-ui/react';
import React, { FC, useCallback } from 'react';
import { usePomodoro } from '../../../hooks/usePomodoro';

export interface PomodoroControlProps extends ButtonProps {}

export const PomodoroControl: FC<PomodoroControlProps> = (props) => {
  const { pomodoro, update } = usePomodoro();
  const toggle = useCallback(async () => {
    await update((prev) => ({
      ...prev,
      isRunning: !Boolean(prev?.isRunning),
    }));
  }, [update]);

  return (
    <Button variant="nes" w="100px" id="control" onClick={toggle} {...props}>
      {pomodoro?.isRunning ? 'Pause' : 'Start'}
    </Button>
  );
};
