import {
  Center,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Task, TaskState } from '../../../../../shared/types/tasks';
import { taskStateDictionary } from '../../../../../shared/dictionary/tasks';
import { TasksList, TasksListProps } from '../tasksList/TasksList';
import { Text } from '../../../../ui/atoms/text/Text';
import { useTasksList } from '../../hooks/useTasksList';
import { useGroupedTasksCount } from '../../hooks/useGroupedTasksCount';

export interface TabbedTasksListProps {
  listProps?: Omit<TasksListProps, 'tasks'>;
}

const states = Object.values(TaskState);

export const TabbedTasksList: FC<TabbedTasksListProps> = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { count: tasksCount, getCount } = useGroupedTasksCount();
  const { tasks, loading, setTaskState, updateTask, didFetch } = useTasksList();

  const { listProps } = props;

  useEffect(() => {
    setTaskState(states[activeIndex]);
  }, [activeIndex, setTaskState]);

  const handleTaskUpdate = useCallback(
    async (task: Task) => {
      await updateTask(task.id, (prev) => ({
        ...prev,
        ...task,
      }));

      await getCount();
    },
    [getCount, updateTask]
  );

  return (
    <>
      {loading && !didFetch && (
        <Center>
          <Text>Loading...</Text>
        </Center>
      )}
      <Tabs index={activeIndex} onChange={setActiveIndex}>
        <Center>
          <TabList>
            {states.map((state) => {
              const count = tasksCount ? tasksCount[state] : 0;

              return (
                <Tab isDisabled={!count} key={state}>
                  <Text>
                    {taskStateDictionary[state]}({count})
                  </Text>
                </Tab>
              );
            })}
          </TabList>
        </Center>
        <TabPanels>
          <TabPanel>
            <TasksList
              tasks={tasks ?? []}
              {...listProps}
              itemProps={{
                onTaskChange: handleTaskUpdate,
              }}
            />
          </TabPanel>
          <TabPanel>
            <TasksList
              tasks={tasks ?? []}
              {...listProps}
              itemProps={{
                onTaskChange: handleTaskUpdate,
              }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
