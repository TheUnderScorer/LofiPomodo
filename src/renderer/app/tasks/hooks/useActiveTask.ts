import { useRecoilState } from 'recoil';
import { activeTask } from '../state/activeTask';
import { useCallback } from 'react';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { Task, TaskEvents, TaskState } from '../../../../shared/types/tasks';
import { useIpcReceiver } from '../../../shared/ipc/useIpcReceiver';

export const useActiveTask = () => {
  const [fetchActiveTask, { loading, error }] = useIpcInvoke<
    never,
    Task | null
  >(TaskEvents.GetActiveTask, {
    invokeAtMount: true,
    recoilAtom: activeTask,
  });

  const [activeTaskVal, setActiveTask] = useRecoilState(activeTask);

  const handleTaskChange = useCallback(
    (_: undefined, task: Task) => {
      if (task.index === 0) {
        if (task.state === TaskState.Todo) {
          setActiveTask(task);
        } else {
          setActiveTask(null);
        }
      }
    },
    [setActiveTask]
  );
  useIpcReceiver(TaskEvents.TaskUpdated, handleTaskChange);

  return {
    activeTask: activeTaskVal,
    fetchActiveTask,
    loading,
    error,
  };
};
