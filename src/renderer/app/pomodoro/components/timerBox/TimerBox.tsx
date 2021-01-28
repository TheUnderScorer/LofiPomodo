import {
  Box,
  BoxProps,
  Center,
  Flex,
  Stack,
  StackProps,
} from '@chakra-ui/core';
import React, { FC } from 'react';
import { usePomodoro } from '../../hooks/usePomodoro';
import { PomodoroStateEnum } from '../../../../../shared/types';
import { Text } from '../../../../ui/atoms/text/Text';
import { pomodoroStateDictionary } from '../../../../../shared/dictionary/pomodoro';
import { Heading } from '../../../../ui/atoms/heading/Heading';
import { HourglassIcon } from '../../../../ui/atoms/icons';
import { PomodoroControl } from '../buttons/pomodoroControl/PomodoroControl';
import { ResetState } from '../buttons/resetState/ResetState';
import { ActiveTaskTitle } from '../../../tasks/components/activeTaskTitle/ActiveTaskTitle';
import { NextStateBtn } from '../buttons/skipBreak/NextStateBtn';
import { usePlatform } from '../../../system/hooks/usePlatform';
import { PomodoroMenuBtn } from '../pomodoroMenu/PomodoroMenuBtn';
import { useGetSetting } from '../../../settings/hooks/useGetSetting';
import { ToggleTasksListBtn } from '../../../tasks/components/toggleTasksListBtn/ToggleTasksListBtn';

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
      bg={`brand.${pomodoro?.state ?? PomodoroStateEnum.Work}`}
      className="timer-box"
      {...containerProps}
    >
      <Stack height="100%" spacing={4} {...stackProps}>
        <Flex mt="0 !important" pl={2} pr={2} justifyContent="space-between">
          <Text className="pomodoro-state-text" color="white">
            {pomodoroStateDictionary[pomodoro?.state ?? PomodoroStateEnum.Work]}
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
              top="-20px"
              left="12px"
            >
              {pomodoro?.shortBreakCount}/{pomodoroSettings?.longBreakInterval}
            </Text>
            <HourglassIcon width="16px" height="27px" variant="dark" />
            <Heading
              className="remaining-time"
              as="h1"
              fontSize="4xl"
              color="white"
            >
              {pomodoro!.remainingTime}
            </Heading>
            <NextStateBtn size="xs" variant="outline" />
          </Stack>
        </Stack>
        <Center>
          <ActiveTaskTitle color="white" />
        </Center>
        <Center mt="1em !important" w="100%">
          <ToggleTasksListBtn position="absolute" left={2} variant="outline" />
          <Stack direction="row" spacing={2}>
            <PomodoroControl color="white" />
            <ResetState iconProps={{ variant: 'light' }} />
            {is?.windows && showSettingsBtnInFooterOnWindows && (
              <PomodoroMenuBtn variant="outline" />
            )}
          </Stack>
        </Center>
      </Stack>
    </Box>
  );
};
