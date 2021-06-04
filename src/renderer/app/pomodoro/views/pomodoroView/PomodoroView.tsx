import React, { FC } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { usePomodoro } from '../../hooks/usePomodoro';
import { TitleBar } from '../../../../ui/molecules/titleBar/TitleBar';
import { PomodoroMenuBtn } from '../../components/pomodoroMenu/PomodoroMenuBtn';
import { TimerBox } from '../../components/timerBox/TimerBox';
import { TabbedTasksList } from '../../../tasks/components/tabbedTasksList/TabbedTasksList';
import { usePlatform } from '../../../system/hooks/usePlatform';
import { CenterContainer } from '../../../../ui/templates/centerContainer/CenterContainer';
import { usePomodoroListeners } from '../../hooks/usePomodoroListeners';
import { useTasksListeners } from '../../../tasks/hooks/useTaskListeners';
import { useGetSetting } from '../../../settings/hooks/useGetSetting';

export interface PomodoroViewProps {}

export const PomodoroView: FC<PomodoroViewProps> = () => {
  usePomodoroListeners();
  useTasksListeners();

  const { data: taskSettings } = useGetSetting('taskSettings');

  const { pomodoro } = usePomodoro();

  const { is } = usePlatform();

  const colorMode = useColorMode();

  if (!pomodoro) {
    return null;
  }

  return (
    <>
      <TitleBar pt={2} pr={2}>
        {!is?.windows && <PomodoroMenuBtn />}
      </TitleBar>
      <CenterContainer className={`pomodoro-view-${colorMode}`} id="timer">
        <Box h="100%" w="100%" d="flex" flexDirection="column">
          {pomodoro && (
            <>
              <TimerBox
                showSettingsBtnInFooterOnWindows
                showToggleTasksListBtn={Boolean(
                  taskSettings?.showToggleTaskListBtn
                )}
                containerProps={{
                  pt: is?.windows ? 3 : 10,
                  pb: 5,
                }}
              />
              <Box pt={2} flex={1} overflow="hidden">
                <TabbedTasksList
                  listProps={{
                    pb: '100px',
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </CenterContainer>
    </>
  );
};
