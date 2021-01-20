import { useRecoilState } from 'recoil';
import { activeTaskAtom } from '../state/activeTask';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { Task, TaskEvents } from '../../../../shared/types/tasks';

export const useActiveTask = () => {
  const [fetchActiveTask, { loading, error }] = useIpcInvoke<
    never,
    Task | null
  >(TaskEvents.GetActiveTask, {
    invokeAtMount: true,
    recoilAtom: activeTaskAtom,
  });

  const [activeTaskVal] = useRecoilState(activeTaskAtom);

  return {
    activeTask: activeTaskVal,
    fetchActiveTask,
    loading,
    error,
  };
};
