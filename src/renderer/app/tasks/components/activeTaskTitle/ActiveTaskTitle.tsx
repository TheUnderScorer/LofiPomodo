import { Button, Center, Spinner, Tooltip } from '@chakra-ui/core';
import React, { FC } from 'react';
import { useActiveTask } from '../../hooks/useActiveTask';
import { Text } from '../../../../ui/atoms/text/Text';
import { getTaskDurationText } from '../../getTaskDurationText';

export interface ActiveTaskTitleProps {
  color?: string;
}

export const ActiveTaskTitle: FC<ActiveTaskTitleProps> = ({ color }) => {
  const { loading, activeTask } = useActiveTask();

  return (
    <>
      {loading && <Spinner />}
      {
        <Center>
          <Button
            color={color}
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
            <Text color={color} ml="1">
              ({getTaskDurationText(activeTask)})
            </Text>
          )}
        </Center>
      }
    </>
  );
};
