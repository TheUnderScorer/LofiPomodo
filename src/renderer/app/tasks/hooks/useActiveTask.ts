import { useRecoilState } from 'recoil';
import { activeTask } from '../state/activeTask';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { Task, TaskEvents } from '../../../../shared/types/tasks';

export const useActiveTask = () => {
  const [fetchActiveTask, { loading, error }] = useIpcInvoke<
    never,
    Task | null
  >(TaskEvents.GetActiveTask, {
    invokeAtMount: true,
    recoilAtom: activeTask,
  });

  const [activeTaskVal] = useRecoilState(activeTask);

  return {
    activeTask: activeTaskVal,
    fetchActiveTask,
    loading,
    error,
  };
};
