import { Center, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useActiveTask } from '../../hooks/useActiveTask';
import { Text } from '../../../../ui/atoms/text/Text';
import { getTaskDurationText } from '../../getTaskDurationText';
import { Loading } from '../../../../ui/atoms/loading/Loading';

export interface ActiveTaskTitleProps {
  color?: string;
}

export const ActiveTaskTitle: FC<ActiveTaskTitleProps> = ({ color }) => {
  const { loading, activeTask } = useActiveTask();

  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <Center maxWidth="70%" minWidth="400px" className="active-task-title">
          <Text isTruncated color={color}>
            <Tooltip label={activeTask?.title} isDisabled={!activeTask}>
              {activeTask ? activeTask.title : 'No task selected'}
            </Tooltip>
          </Text>

          {activeTask && (
            <Text color={color} ml="1">
              ({getTaskDurationText(activeTask)})
            </Text>
          )}
        </Center>
      )}
    </>
  );
};
