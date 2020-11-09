import { useRecoilState } from 'recoil';
import { activeTask } from '../state/activeTask';
import { useCallback } from 'react';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { Task, TaskEvents } from '../../../../shared/types/tasks';
import { useIpcReceiver } from '../../../shared/ipc/useIpcReceiver';

export const useActiveTask = () => {
  const [fetchInitialTask, { loading, error }] = useIpcInvoke<
    never,
    Task | null
  >(TaskEvents.GetActiveTask, {
    invokeAtMount: true,
    recoilAtom: activeTask,
  });
  const [setActiveTaskIpc] = useIpcInvoke(TaskEvents.SetActiveTask);
  const [activeTaskVal, setActiveTask] = useRecoilState(activeTask);

  const handleSetActiveTask = useCallback(
    async (task: Task) => {
      setActiveTask(task);
      await setActiveTaskIpc(task);
    },
    [setActiveTask, setActiveTaskIpc]
  );

  const handleTaskChange = useCallback(
    (_: undefined, task: Task) => {
      if (!task.active) {
        return;
      }

      setActiveTask(task);
    },
    [setActiveTask]
  );
  useIpcReceiver(TaskEvents.TaskUpdated, handleTaskChange);

  return {
    activeTask: activeTaskVal,
    setActiveTask: handleSetActiveTask,
    fetchInitialTask,
    loading,
    error,
  };
};
