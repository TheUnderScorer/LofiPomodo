import React, { FC } from 'react';
import { Box, Container, Flex, useColorMode } from '@chakra-ui/core';
import { usePomodoro } from '../../hooks/usePomodoro';
import { PomodoroState } from '../../../../../shared/types';
import { TitleBar } from '../../../../ui/atoms/titleBar/TitleBar';
import { PomodoroMenu } from '../../components/pomodoroMenu/PomodoroMenu';
import { TimerBox } from '../../components/timerBox/TimerBox';
import { TabbedTasksList } from '../../../tasks/components/tabbedTasksList/TabbedTasksList';

export interface PomodoroViewProps {
  breakMode?: boolean;
}

export const PomodoroView: FC<PomodoroViewProps> = ({ breakMode = false }) => {
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
        bg={
          breakMode
            ? `brand.${pomodoro?.state ?? PomodoroState.Work}`
            : undefined
        }
      >
        <Box h="100%" w="100%" d="flex" flexDirection="column">
          {pomodoro && (
            <>
              <TimerBox
                containerProps={{
                  pt: 10,
                  height: '240px',
                }}
              />
              <Box flex={1} overflow="visible">
                <TabbedTasksList
                  listProps={{
                    height: 'calc(100vh - 340px)',
                    pb: 5,
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
