import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { TaskEvents } from '../../../../shared/types/tasks';
import { groupedTasksCountStore } from '../state/groupedTasksCount';

export const useGroupedTasksCount = () => {
  const [getCount, { result: count }] = useIpcInvoke(TaskEvents.CountByState, {
    recoilAtom: groupedTasksCountStore,
    invokeAtMount: true,
  });

  return {
    count: count!,
    getCount,
  };
};
