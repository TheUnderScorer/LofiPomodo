import { Button, ButtonProps } from '@chakra-ui/core';
import React, { FC, useCallback } from 'react';
import { usePomodoro } from '../../../hooks/usePomodoro';

export interface PomodoroControlProps extends ButtonProps {}

export const PomodoroControl: FC<PomodoroControlProps> = (props) => {
  const { pomodoro, update } = usePomodoro();
  const toggle = useCallback(() => {
    update((prev) => ({
      ...prev,
      isRunning: !Boolean(prev?.isRunning),
    }));
  }, [update]);

  return (
    <Button
      w="100px"
      id="control"
      onClick={toggle}
      variant="outline"
      {...props}
    >
      {pomodoro?.isRunning ? 'Pause' : 'Start'}
    </Button>
  );
};
