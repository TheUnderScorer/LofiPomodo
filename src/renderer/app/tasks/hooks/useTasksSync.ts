import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import {
  IsSyncingWithApisResult,
  TaskEvents,
  TaskSynchronizerEvents,
} from '../../../../shared/types/tasks';
import { useCallback, useState } from 'react';
import { useMount } from 'react-use';
import { useIpcSubscriber } from '../../../shared/ipc/useIpcSubscriber';
import { useTasksList } from './useTasksList';
import { useGroupedTasksCount } from './useGroupedTasksCount';
import { useActiveTask } from './useActiveTask';

export const useTasksSync = () => {
  const { getTasks } = useTasksList();
  const { getCount } = useGroupedTasksCount();
  const { fetchActiveTask } = useActiveTask();

  const [
    sync,
    { loading: isSyncingFromInvoke, error: syncErrorFromInvoke },
  ] = useIpcInvoke<never>(TaskEvents.SyncWithApis);

  const [getIsSyncing] = useIpcInvoke<never, IsSyncingWithApisResult>(
    TaskEvents.IsSyncingWithApis
  );

  const [isSyncing, setIsSyncing] = useState(false);

  useMount(() => {
    getIsSyncing().then((result) => setIsSyncing(result.isSyncing));
  });

  useIpcSubscriber(
    TaskSynchronizerEvents.SyncEnded,
    useCallback(() => {
      setIsSyncing(false);
    }, [])
  );

  return {
    isSyncing: isSyncing || isSyncingFromInvoke,
    sync: useCallback(async () => {
      await sync();
      await Promise.all([getTasks(), getCount(), fetchActiveTask()]);
    }, [fetchActiveTask, getCount, getTasks, sync]),
    error: syncErrorFromInvoke,
  };
};
