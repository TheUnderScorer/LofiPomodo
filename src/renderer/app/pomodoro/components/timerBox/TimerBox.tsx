import { Box, BoxProps, Center, Flex, Stack } from '@chakra-ui/core';
import React, { FC } from 'react';
import { usePomodoro } from '../../hooks/usePomodoro';
import { PomodoroState } from '../../../../../shared/types';
import { Text } from '../../../../ui/atoms/text/Text';
import { pomodoroStateDictionary } from '../../../../../shared/dictionary/pomodoro';
import { Heading } from '../../../../ui/atoms/heading/Heading';
import { HourglassIcon } from '../../../../ui/atoms/icons';
import { PomodoroControl } from '../buttons/pomodoroControl/PomodoroControl';
import { ResetState } from '../buttons/resetState/ResetState';
import { ActiveTaskTitle } from '../../../tasks/components/activeTaskTitle/ActiveTaskTitle';

export interface TimerProps {
  containerProps?: BoxProps;
}

export const TimerBox: FC<TimerProps> = ({ containerProps = {} }) => {
  const { pomodoro } = usePomodoro();

  return (
    <Box
      height="240px"
      bg={`brand.${pomodoro?.state ?? PomodoroState.Work}`}
      {...containerProps}
    >
      <Stack height="100%" spacing={4}>
        <Flex mt="0 !important" pl={2} pr={2} justifyContent="space-between">
          <Text color="white">
            {pomodoroStateDictionary[pomodoro?.state ?? PomodoroState.Work]}
          </Text>
        </Flex>
        <Stack
          mt="0 !important"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          <Stack direction="row" spacing={2} alignItems="baseline">
            <HourglassIcon width="16px" height="27px" variant="dark" />
            <Heading as="h1" size="4xl" fontSize="2.5rem" color="white">
              {pomodoro!.remainingTime}
            </Heading>
          </Stack>
        </Stack>
        <Center>
          <ActiveTaskTitle color="white" />
        </Center>
        <Center mt="1em !important">
          <Stack direction="row" spacing={2}>
            <PomodoroControl color="white" />
            <ResetState iconProps={{ variant: 'light' }} />
          </Stack>
        </Center>
      </Stack>
    </Box>
  );
};
