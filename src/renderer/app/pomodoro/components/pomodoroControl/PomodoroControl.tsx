import { IconButton } from '@chakra-ui/core';
import React, { FC, useCallback } from 'react';
import { usePomodoro } from '../../hooks/usePomodoro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

export interface PomodoroControlProps {}

export const PomodoroControl: FC<PomodoroControlProps> = () => {
  const { pomodoro, update } = usePomodoro();

  const toggle = useCallback(() => {
    update((prev) => ({
      ...prev,
      isRunning: !Boolean(prev?.isRunning),
    }));
  }, [update]);

  return (
    <IconButton
      w="40px"
      onClick={toggle}
      aria-label="Toggle pomodoro timer"
      variant="solid"
      fontSize="20px"
      icon={<FontAwesomeIcon icon={pomodoro?.isRunning ? faPause : faPlay} />}
    />
  );
};
