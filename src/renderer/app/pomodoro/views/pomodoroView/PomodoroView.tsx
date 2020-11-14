import React, { FC } from 'react';
import { Box, Container, Flex, useColorMode } from '@chakra-ui/core';
import { usePomodoro } from '../../hooks/usePomodoro';
import { TitleBar } from '../../../../ui/atoms/titleBar/TitleBar';
import { PomodoroMenu } from '../../components/pomodoroMenu/PomodoroMenu';
import { TimerBox } from '../../components/timerBox/TimerBox';
import { TabbedTasksList } from '../../../tasks/components/tabbedTasksList/TabbedTasksList';
import { getPlatform } from '../../../../../shared/platform/getPlatform';

export interface PomodoroViewProps {}

export const PomodoroView: FC<PomodoroViewProps> = () => {
  const { pomodoro } = usePomodoro();

  const colorMode = useColorMode();

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
                  pt: getPlatform() !== 'win32' ? 10 : 0,
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
