import { CircularProgress, CircularProgressLabel } from '@chakra-ui/core';
import React, { FC } from 'react';
import { usePomodoro } from '../../hooks/usePomodoro';
import { PomodoroState } from '../../../../../shared/types';
import { useBreakpointValue } from '@chakra-ui/media-query';
import './TimerProgress.css';

export interface TimerProgressProps {
  colored?: boolean;
}

export const TimerProgress: FC<TimerProgressProps> = ({ colored = true }) => {
  const { pomodoro, loading } = usePomodoro();

  const size = useBreakpointValue({
    base: '250px',
    xs: '200px',
    sm: '300px',
    md: '500px',
    lg: '600px',
  });

  const fontSize = useBreakpointValue({
    base: '20px',
    xs: '20px',
    sm: '70px',
    md: '90px',
    lg: '100px',
  });

  return (
    <div className="timer-progress">
      <CircularProgress
        size={size}
        value={pomodoro?.remainingPercentage ?? 0}
        thickness="4px"
        isIndeterminate={loading}
        trackColor={colored ? 'gray.100' : 'gray.400'}
        color={
          colored
            ? `brand.${pomodoro?.state ?? PomodoroState.Work}`
            : 'gray.100'
        }
      >
        <CircularProgressLabel
          color="brand.textPrimary"
          className="timer-text"
          fontSize={fontSize}
        >
          {pomodoro?.remainingTime}
        </CircularProgressLabel>
      </CircularProgress>
    </div>
  );
};
