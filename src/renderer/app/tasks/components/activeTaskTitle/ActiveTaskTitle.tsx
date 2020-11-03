import { Button, Center, Spinner, Tooltip } from '@chakra-ui/core';
import React, { FC } from 'react';
import { useActiveTask } from '../../hooks/useActiveTask';
import { Text } from '../../../../ui/atoms/text/Text';
import { getTaskDurationText } from '../../getTaskDurationText';
import { AddTaskBtn } from '../addTaskBtn/AddTaskBtn';

export interface ActiveTaskTitleProps {}

export const ActiveTaskTitle: FC<ActiveTaskTitleProps> = () => {
  const { loading, activeTask } = useActiveTask();

  return (
    <>
      {loading && <Spinner />}
      {
        <Center>
          <Button
            minW="none"
            maxW="90%"
            justifyContent="flex-start"
            isTruncated
            variant="link"
          >
            <Tooltip label={activeTask?.title} isDisabled={!activeTask}>
              {activeTask ? activeTask.title : 'No task selected'}
            </Tooltip>
          </Button>
          {activeTask && (
            <Text ml="1">({getTaskDurationText(activeTask)})</Text>
          )}
          <AddTaskBtn ml="2" size="sm" isRound />
        </Center>
      }
    </>
  );
};
