import React, { FC, useMemo } from 'react';
import {
  Box,
  ColorModeProvider,
  Container,
  Flex,
  ThemeProvider,
  useColorMode,
  useTheme,
} from '@chakra-ui/core';
import { usePomodoro } from '../hooks/usePomodoro';
import { PomodoroState } from '../../../../shared/types';
import { TitleBar } from '../../../ui/atoms/titleBar/TitleBar';
import { theme as chakraTheme } from '@chakra-ui/theme';
import { Theme } from '../../../types/theme';
import { PomodoroMenu } from '../components/pomodoroMenu/PomodoroMenu';
import { TimerBox } from '../components/timerBox/TimerBox';

export interface PomodoroViewProps {
  breakMode?: boolean;
}

export const PomodoroView: FC<PomodoroViewProps> = ({ breakMode = false }) => {
  const { pomodoro } = usePomodoro();

  if (!pomodoro) {
    return null;
  }

  return (
    <>
      <TitleBar>
        <Flex justifyContent="flex-end" pt={2} pr={4}>
          <PomodoroMenu />
        </Flex>
      </TitleBar>
      <Container
        pl={0}
        pr={0}
        id="timer"
        height="100vh"
        centerContent
        width="100%"
        maxW="100%"
        bg={
          breakMode
            ? `brand.${pomodoro?.state ?? PomodoroState.Work}`
            : undefined
        }
      >
        <Box h="100%" w="100%">
          {pomodoro && (
            <TimerBox
              containerProps={{
                pt: 10,
              }}
            />
          )}
        </Box>
      </Container>
    </>
  );
};
