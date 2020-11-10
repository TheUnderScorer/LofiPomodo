import {
  Box,
  Center,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Task, TaskEvents, TaskState } from '../../../../../shared/types/tasks';
import { taskStateDictionary } from '../../../../../shared/dictionary/tasks';
import { TasksList, TasksListProps } from '../tasksList/TasksList';
import { Text } from '../../../../ui/atoms/text/Text';
import { useTasksList } from '../../hooks/useTasksList';
import { useGroupedTasksCount } from '../../hooks/useGroupedTasksCount';
import { AddTaskInput } from '../addTaskInput/AddTaskInput';
import { getById } from '../../../../../shared/utils/getters';
import { useIpcInvoke } from '../../../../shared/ipc/useIpcInvoke';
import { useDebounce, useSet } from 'react-use';

export interface TabbedTasksListProps {
  listProps?: Omit<TasksListProps, 'tasks'>;
}

const states = Object.values(TaskState);

export const TabbedTasksList: FC<TabbedTasksListProps> = (props) => {
  const [isDirty, setIsDirty] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { count: tasksCount, getCount } = useGroupedTasksCount();
  const { tasks, loading, setTaskState, didFetch, getTasks } = useTasksList();
  const [updateTasksMutation] = useIpcInvoke<Task[], Task[]>(
    TaskEvents.UpdateTasks
  );
  const [tasksState, setStoredTasks] = useState<Task[]>(tasks);
  const [changedTasks, changedTasksSet] = useSet(new Set<string>());

  const { listProps } = props;

  useEffect(() => {
    setTaskState(states[activeIndex]);
  }, [activeIndex, setTaskState]);

  const handleTaskUpdate = useCallback(async () => {
    const tasksToUpdate = Array.from(changedTasks)
      .map((id) => getById(tasksState, id))
      .filter(Boolean) as Task[];

    changedTasksSet.reset();

    setIsDirty(false);

    console.log('Updating tasks...', { tasksToUpdate });

    await updateTasksMutation(tasksToUpdate);

    await Promise.all([getCount(), getTasks()]);
  }, [
    changedTasks,
    changedTasksSet,
    getCount,
    getTasks,
    tasksState,
    updateTasksMutation,
  ]);

  const handleTaskChange = useCallback(
    async (task: Task) => {
      console.log('Task changed', { task });

      const index = tasksState.findIndex(({ id }) => task.id === id);

      const newTasks = [...tasksState];
      newTasks[index] = task;

      setStoredTasks(newTasks);
      changedTasksSet.add(task.id);

      setIsDirty(true);
    },
    [changedTasksSet, tasksState]
  );

  useEffect(() => {
    setStoredTasks(tasks);
  }, [tasks]);

  useDebounce(
    async () => {
      if (isDirty) {
        await handleTaskUpdate();
      }
    },
    1000,
    [isDirty, handleTaskUpdate]
  );

  return (
    <Box position="relative">
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
                <Tab key={state}>
                  <Text>
                    {taskStateDictionary[state]}({count})
                  </Text>
                </Tab>
              );
            })}
          </TabList>
        </Center>
        {loading && (
          <Spinner
            color="brand.primary"
            position="absolute"
            right="10px"
            top="10px"
          />
        )}
        <TabPanels>
          <TabPanel pr="0.5rem" pl="0.5rem">
            <Box mb={6}>
              <AddTaskInput />
            </Box>
            <TasksList
              loading={loading}
              tasks={tasks ?? []}
              {...listProps}
              itemProps={{
                onTaskChange: handleTaskChange,
              }}
            />
          </TabPanel>
          <TabPanel pr="0.5rem" pl="0.5rem">
            <TasksList
              loading={loading}
              tasks={tasks ?? []}
              {...listProps}
              itemProps={{
                onTaskChange: handleTaskChange,
              }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
