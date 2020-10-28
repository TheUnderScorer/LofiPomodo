import {
  CircularProgress,
  CircularProgressLabel,
  Stack,
  useBreakpointValue,
  useTheme,
} from '@chakra-ui/core';
import React, { FC, useCallback, useMemo } from 'react';
import { usePomodoro } from '../../hooks/usePomodoro';
import { times } from 'ramda';
import { PomodoroState } from '../../../../../shared/types';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface PomodoroIntervalProps {}

export const PomodoroInterval: FC<PomodoroIntervalProps> = () => {
  const { pomodoro } = usePomodoro();

  const theme = useTheme();

  const getValue = useCallback(
    (interval: number) => {
      if (interval > pomodoro!.shortBreakCount) {
        return 100;
      }

      if (interval === pomodoro!.shortBreakCount) {
        if (pomodoro!.state !== PomodoroState.Work) {
          return 0;
        }

        return pomodoro!.remainingPercentage;
      }

      return 0;
    },
    [pomodoro]
  );

  const size = useBreakpointValue({
    base: '20px',
    xs: '20px',
    sm: '25px',
    md: '40px',
    lg: '60px',
  });

  const iconSize = useMemo(() => parseInt(size!, 10) / 2.5, [size]);

  return (
    <Stack direction="row" spacing={1}>
      {times((interval) => {
        const value = getValue(interval);

        return (
          <CircularProgress
            size={size}
            key={interval}
            color={
              interval === pomodoro!.shortBreakCount ? 'gray.300' : 'gray.100'
            }
            trackColor={`brand.${PomodoroState.Work}`}
            value={value}
          >
            <CircularProgressLabel>
              {value === 0 ? (
                <FontAwesomeIcon
                  style={{
                    width: iconSize,
                    height: iconSize,
                  }}
                  className="timer-progress-icon"
                  color={theme.colors.brand.textPrimary}
                  icon={faCheck}
                />
              ) : null}
            </CircularProgressLabel>
          </CircularProgress>
        );
      }, pomodoro?.longBreakInterval ?? 4)}
    </Stack>
  );
};
