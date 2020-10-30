import { useRecoilState } from 'recoil';
import { activeTask } from '../state/activeTask';
import { useCallback, useEffect, useState } from 'react';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { Task, TaskEvents } from '../../../../shared/types/tasks';

export const useActiveTask = () => {
  const [didInit, setDidInit] = useState(false);
  const [fetchInitialTask, { loading, error }] = useIpcInvoke<never, Task>(
    TaskEvents.GetActiveTask
  );
  const [setActiveTaskIpc] = useIpcInvoke(TaskEvents.SetActiveTask);
  const [activeTaskVal, setActiveTask] = useRecoilState(activeTask);

  const handleSetActiveTask = useCallback(
    async (task: Task) => {
      setActiveTask(task);
      await setActiveTaskIpc(task);
    },
    [setActiveTask, setActiveTaskIpc]
  );

  useEffect(() => {
    if (!didInit) {
      setDidInit(true);
      fetchInitialTask().then((foundTask) => {
        setActiveTask(foundTask);
      });
    }
  }, [didInit, fetchInitialTask, setActiveTask]);

  return {
    activeTask: activeTaskVal,
    setActiveTask: handleSetActiveTask,
    loading,
    error,
  };
};
