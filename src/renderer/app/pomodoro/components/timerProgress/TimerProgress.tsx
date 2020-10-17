import { CircularProgress, CircularProgressLabel } from '@chakra-ui/core';
import React, { FC } from 'react';
import { usePomodoro } from '../../hooks/usePomodoro';
import { PomodoroState } from '../../../../../shared/types';
import { useBreakpointValue } from '@chakra-ui/media-query';
import './TimerProgress.css';

export interface TimerProgressProps {
  breakMode?: boolean;
}

export const TimerProgress: FC<TimerProgressProps> = ({ breakMode = true }) => {
  const { pomodoro, loading } = usePomodoro();

  const size = useBreakpointValue({
    base: '250px',
    xs: '200px',
    sm: '250px',
    md: '400px',
    lg: '500px',
    xl: '600px',
  });

  const fontSize = useBreakpointValue({
    base: '40px',
    xs: '40px',
    sm: '60px',
    md: '90px',
  });

  return (
    <div className="timer-progress">
      <CircularProgress
        size={size}
        value={pomodoro?.remainingPercentage ?? 0}
        thickness="4px"
        isIndeterminate={loading}
        color="gray.100"
        trackColor={
          !breakMode
            ? `brand.${pomodoro?.state ?? PomodoroState.Work}`
            : 'gray.400'
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
