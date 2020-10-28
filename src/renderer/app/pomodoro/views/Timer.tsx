import React, { FC, useMemo } from 'react';
import {
  Center,
  ColorModeProvider,
  Container,
  Flex,
  Stack,
  ThemeProvider,
  useColorMode,
  useTheme,
} from '@chakra-ui/core';
import { TimerProgress } from '../components/timerProgress/TimerProgress';
import { PomodoroControl } from '../components/pomodoroControl/PomodoroControl';
import { pomodoroStateDictionary } from '../../../../shared/dictionary/pomodoro';
import { usePomodoro } from '../hooks/usePomodoro';
import { PomodoroState } from '../../../../shared/types';
import { TitleBar } from '../../../ui/atoms/titleBar/TitleBar';
import { theme as chakraTheme } from '@chakra-ui/theme';
import { Heading } from '../../../ui/atoms/heading/Heading';
import { PomodoroInterval } from '../components/pomodoroInterval/PomodoroInterval';
import { Theme } from '../../../types/theme';
import { PomodoroMenu } from '../components/pomodoroMenu/PomodoroMenu';

export interface TimerProps {
  breakMode?: boolean;
}

export const Timer: FC<TimerProps> = ({ breakMode = false }) => {
  const { pomodoro } = usePomodoro();

  const orgTheme = useTheme() as Theme;
  const { colorMode } = useColorMode();

  const theme = useMemo<Theme>(() => {
    return {
      ...orgTheme,
      colors: {
        ...orgTheme.colors,
        brand: {
          ...orgTheme.colors.brand,
          textPrimary: chakraTheme.colors.black,
          textSecondary: chakraTheme.colors.gray['500'],
          iconPrimary: chakraTheme.colors.gray['400'],
        },
      },
      config: {
        initialColorMode: 'light',
      },
    };
  }, [orgTheme]);

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
      <ThemeProvider theme={breakMode ? theme : orgTheme}>
        <ColorModeProvider options={{}} value={breakMode ? 'light' : colorMode}>
          <Container
            id="timer"
            pt="10"
            pb="10"
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
            <Center h="100%" w="100%">
              <Stack w="100%" spacing={2}>
                {pomodoro && (
                  <>
                    <Center>
                      <Heading>
                        {pomodoroStateDictionary[pomodoro.state]}
                      </Heading>
                    </Center>
                    <TimerProgress breakMode={breakMode} />
                    {!breakMode && (
                      <Center>
                        <PomodoroInterval />
                      </Center>
                    )}
                    <Center mt="20px !important">
                      <PomodoroControl />
                    </Center>
                  </>
                )}
              </Stack>
            </Center>
          </Container>
        </ColorModeProvider>
      </ThemeProvider>
    </>
  );
};
