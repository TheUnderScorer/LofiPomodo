import React, { FC, useMemo } from 'react';
import {
  Center,
  Container,
  Stack,
  ThemeProvider,
  useTheme,
} from '@chakra-ui/core';
import { TimerProgress } from './timerProgress/TimerProgress';
import { PomodoroControl } from './pomodoroControl/PomodoroControl';
import { pomodoroStateDictionary } from '../../../../shared/dictionary/pomodoro';
import { usePomodoro } from '../hooks/usePomodoro';
import { PomodoroState } from '../../../../shared/types';
import { TitleBar } from '../../../ui/atoms/titleBar/TitleBar';
import { theme as chakraTheme } from '@chakra-ui/theme';
import { Heading } from '../../../ui/atoms/heading/Heading';

export interface TimerProps {
  fullScreenMode?: boolean;
}

export const Timer: FC<TimerProps> = ({ fullScreenMode = false }) => {
  const { pomodoro } = usePomodoro();

  const orgTheme = useTheme();
  const theme = useMemo(() => {
    return {
      ...orgTheme,
      colors: {
        ...orgTheme.colors,
        brand: {
          ...orgTheme.colors.brand,
          textPrimary: chakraTheme.colors.white,
          textSecondary: chakraTheme.colors.gray['500'],
        },
      },
    };
  }, [orgTheme]);

  return (
    <>
      {!fullScreenMode && <TitleBar />}
      <ThemeProvider theme={fullScreenMode ? theme : orgTheme}>
        <Container
          height="100vh"
          centerContent
          width="100%"
          maxW="100%"
          bg={
            fullScreenMode
              ? `brand.${pomodoro?.state ?? PomodoroState.Work}`
              : undefined
          }
        >
          <Center h="100%" w="100%">
            <Stack w="100%" spacing={4}>
              {pomodoro && (
                <>
                  <Center>
                    <Heading>{pomodoroStateDictionary[pomodoro.state]}</Heading>
                  </Center>
                  <TimerProgress colored={!fullScreenMode} />
                  <Center>
                    <PomodoroControl />
                  </Center>
                </>
              )}
            </Stack>
          </Center>
        </Container>
      </ThemeProvider>
    </>
  );
};
