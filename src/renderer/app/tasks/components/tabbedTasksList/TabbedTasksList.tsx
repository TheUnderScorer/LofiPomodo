import {
  Badge,
  Box,
  Center,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/core';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Task, TaskEvents, TaskState } from '../../../../../shared/types/tasks';
import { taskStateDictionary } from '../../../../../shared/dictionary/tasks';
import { TasksList, TasksListProps } from '../tasksList/TasksList';
import { Text } from '../../../../ui/atoms/text/Text';
import { useTasksList } from '../../hooks/useTasksList';
import { useGroupedTasksCount } from '../../hooks/useGroupedTasksCount';
import { AddTaskInput } from '../addTaskInput/AddTaskInput';
import { useIpcInvoke } from '../../../../shared/ipc/useIpcInvoke';
import { Heading } from '../../../../ui/atoms/heading/Heading';
import { useActiveTask } from '../../hooks/useActiveTask';
import { TaskContextMenu } from '../taskContextMenu/TaskContextMenu';
import { TasksMenu } from '../tasksMenu/TasksMenu';
import { useUpdateTask } from '../../hooks/useUpdateTask';

export interface TabbedTasksListProps {
  listProps?: Omit<TasksListProps, 'tasks'>;
}

const states = Object.values(TaskState);

export const TabbedTasksList: FC<TabbedTasksListProps> = (props) => {
  const isDragRef = useRef(false);

  const { count: tasksCount } = useGroupedTasksCount();
  const { tasks, loading, setTaskState, didFetch, getTasks } = useTasksList();
  const { fetchActiveTask } = useActiveTask();
  const { updateTask } = useUpdateTask();

  const [activeIndex, setActiveIndex] = useState(0);
  const [tasksState, setStoredTasks] = useState<Task[]>(tasks);

  const activeState = useMemo(() => states[activeIndex], [activeIndex]);

  const [updateTasksMutation, { loading: isUpdating }] = useIpcInvoke<
    Task[],
    Task[]
  >(TaskEvents.UpdateTasks);

  const { listProps } = props;

  useEffect(() => {
    setTaskState(activeState);
  }, [activeState, setTaskState]);

  const handleTaskChange = useCallback(
    async (task: Task) => {
      const index = tasksState.findIndex(({ id }) => task.id === id);

      const newTasks = [...tasksState];
      newTasks[index] = task;

      setStoredTasks(newTasks);

      await updateTask(task);
    },
    [tasksState, updateTask]
  );

  useEffect(() => {
    if (isDragRef.current) {
      return;
    }

    setStoredTasks(tasks);
  }, [tasks]);

  const contextMenu = useCallback(
    (task: Task) => <TaskContextMenu task={task} />,
    []
  );

  const handleListDragEnd = useCallback(
    async (tasks: Task[]) => {
      isDragRef.current = true;
      setStoredTasks(tasks);

      await updateTasksMutation(tasks);
      await Promise.all([fetchActiveTask(), getTasks()]);

      isDragRef.current = false;
    },
    [fetchActiveTask, getTasks, updateTasksMutation]
  );

  return (
    <Box h="100%" position="relative">
      {loading && !didFetch && (
        <Center>
          <Text>Loading...</Text>
        </Center>
      )}
      <Tabs isLazy h="100%" index={activeIndex} onChange={setActiveIndex}>
        <Center>
          <TabList>
            {states.map((state) => {
              const count = tasksCount ? tasksCount[state] : 0;

              return (
                <Tab className={`tabbed-task-state-${state}`} key={state}>
                  <Text mr={1}>{taskStateDictionary[state]}</Text>
                  <Badge>{count}</Badge>
                </Tab>
              );
            })}
          </TabList>

          <TasksMenu
            loading={loading || isUpdating}
            menuButtonProps={{
              position: 'absolute',
              top: '10px',
              right: '15px',
              width: '30px',
              height: '30px',
            }}
          />
        </Center>
        <TabPanels h="100%">
          <TabPanel h="100%">
            <Box mb={tasks?.length ? 6 : 0}>
              <AddTaskInput />
            </Box>
            <TasksList
              onListDragEnd={handleListDragEnd}
              emptyContent={
                <Center h="100%">
                  <Stack spacing={2} height="auto" alignItems="center">
                    <Heading size="sm">No tasks found</Heading>
                    <Text>Use input above to add new tasks ✌️</Text>
                  </Stack>
                </Center>
              }
              loading={loading}
              tasks={tasksState}
              {...listProps}
              itemProps={{
                onTaskChange: handleTaskChange,
                contextMenu,
              }}
            />
          </TabPanel>
          <TabPanel h="100%">
            <TasksList
              isDragDisabled
              loading={loading}
              tasks={tasksState}
              {...listProps}
              itemProps={{
                onTaskChange: handleTaskChange,
                contextMenu,
              }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
