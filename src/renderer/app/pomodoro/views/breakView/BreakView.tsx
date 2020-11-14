import { Container } from '@chakra-ui/core';
import React, { FC } from 'react';
import { TimerBox } from '../../components/timerBox/TimerBox';
import { usePomodoro } from '../../hooks/usePomodoro';

export interface BreakViewProps {}

export const BreakView: FC<BreakViewProps> = () => {
  const { pomodoro } = usePomodoro();

  return (
    <Container
      pl={0}
      pr={0}
      id="break_view"
      h="100vh"
      w="100vw"
      maxWidth="auto"
    >
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
    </Container>
  );
};
