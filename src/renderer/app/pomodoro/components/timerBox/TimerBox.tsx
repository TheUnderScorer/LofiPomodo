import {
  Box,
  BoxProps,
  Center,
  Flex,
  Stack,
  StackProps,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { usePomodoro } from '../../hooks/usePomodoro';
import { PomodoroStates } from '../../../../../shared/types';
import { Text } from '../../../../ui/atoms/text/Text';
import { pomodoroStateDictionary } from '../../../../../shared/dictionary/pomodoro';
import { Heading } from '../../../../ui/atoms/heading/Heading';
import { PomodoroControl } from '../buttons/pomodoroControl/PomodoroControl';
import { ResetState } from '../buttons/resetState/ResetState';
import { ActiveTaskTitle } from '../../../tasks/components/activeTaskTitle/ActiveTaskTitle';
import { NextStateBtn } from '../buttons/skipBreak/NextStateBtn';
import { usePlatform } from '../../../system/hooks/usePlatform';
import { PomodoroMenuBtn } from '../pomodoroMenu/PomodoroMenuBtn';
import { useGetSetting } from '../../../settings/hooks/useGetSetting';
import { ToggleTasksListBtn } from '../../../tasks/components/toggleTasksListBtn/ToggleTasksListBtn';
import { Icon } from '../../../../ui/atoms/icons/Icon';

export interface TimerProps {
  containerProps?: BoxProps;
  stackProps?: StackProps;
  showSettingsBtnInFooterOnWindows?: boolean;
  showToggleTasksListBtn?: boolean;
}

export const TimerBox: FC<TimerProps> = ({
  containerProps = {},
  stackProps = {},
  showSettingsBtnInFooterOnWindows,
  showToggleTasksListBtn,
}) => {
  const { data: pomodoroSettings } = useGetSetting('pomodoroSettings');
  const { pomodoro } = usePomodoro();
  const { is } = usePlatform();

  return (
    <Box
      bg={`brand.${pomodoro?.state ?? PomodoroStates.Work}`}
      className="timer-box"
      {...containerProps}
    >
      <Stack height="100%" spacing={4} {...stackProps}>
        <Flex mt="0 !important" pl={2} pr={2} justifyContent="space-between">
          <Text className="pomodoro-state-text" color="white">
            {pomodoroStateDictionary[pomodoro?.state ?? PomodoroStates.Work]}
          </Text>
        </Flex>
        <Stack
          mt="0 !important"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="baseline"
            position="relative"
          >
            <Text
              fontSize="xs"
              color="white"
              position="absolute"
              top="-15px"
              left="8px"
            >
              {pomodoro?.shortBreakCount}/{pomodoroSettings?.longBreakInterval}
            </Text>
            <Icon name="Clock" boxSize={6} />
            <Heading
              className="remaining-time"
              as="h1"
              fontSize="4xl"
              color="white"
            >
              {pomodoro!.remainingTime}
            </Heading>
            <NextStateBtn bottom="3px" size="xs" />
          </Stack>
        </Stack>
        <Center>
          <ActiveTaskTitle color="white" />
        </Center>
        <Center mt="1em !important" w="100%">
          {showToggleTasksListBtn && (
            <ToggleTasksListBtn
              position="absolute"
              left={2}
              variant="outline"
            />
          )}
          <Stack direction="row" spacing={4}>
            <PomodoroControl />
            <ResetState />
            {is?.windows && showSettingsBtnInFooterOnWindows && (
              <PomodoroMenuBtn variant="nes" />
            )}
          </Stack>
        </Center>
      </Stack>
    </Box>
  );
};
