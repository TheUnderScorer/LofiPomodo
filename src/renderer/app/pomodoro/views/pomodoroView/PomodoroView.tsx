import React, { FC } from 'react';
import { Box, Container, useColorMode } from '@chakra-ui/core';
import { usePomodoro } from '../../hooks/usePomodoro';
import { TitleBar } from '../../../../ui/molecules/titleBar/TitleBar';
import { PomodoroMenu } from '../../components/pomodoroMenu/PomodoroMenu';
import { TimerBox } from '../../components/timerBox/TimerBox';
import { TabbedTasksList } from '../../../tasks/components/tabbedTasksList/TabbedTasksList';
import { usePlatform } from '../../../system/hooks/usePlatform';

export interface PomodoroViewProps {}

export const PomodoroView: FC<PomodoroViewProps> = () => {
  const { pomodoro } = usePomodoro();

  const platform = usePlatform();

  const colorMode = useColorMode();

  if (!pomodoro) {
    return null;
  }

  return (
    <>
      <TitleBar pt={2} pr={2}>
        {platform !== 'win32' && <PomodoroMenu />}
      </TitleBar>
      <Container
        className={`pomodoro-view-${colorMode}`}
        pl={0}
        pr={0}
        id="timer"
        height="100vh"
        centerContent
        width="100%"
        maxW="100%"
      >
        <Box h="100%" w="100%" d="flex" flexDirection="column">
          {pomodoro && (
            <>
              <TimerBox
                containerProps={{
                  pt: platform === 'win32' ? 3 : 10,
                  pb: 5,
                }}
              />
              <Box flex={1} overflow="hidden">
                <TabbedTasksList
                  listProps={{
                    pb: '100px',
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </Container>
    </>
  );
};
