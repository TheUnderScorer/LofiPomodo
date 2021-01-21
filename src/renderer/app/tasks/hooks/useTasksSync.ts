import { useIpcMutation } from '../../../shared/ipc/useIpcMutation';
import {
  IsSyncingWithApisResult,
  TaskEvents,
  TaskSynchronizerSubscriptionTopics,
} from '../../../../shared/types/tasks';
import { useCallback, useState } from 'react';
import { useIpcSubscriber } from '../../../shared/ipc/useIpcSubscriber';
import { useIpcQuery } from '../../../shared/ipc/useIpcQuery';

export const useTasksSync = () => {
  const syncMutation = useIpcMutation<void>(TaskEvents.SyncWithApis, {
    invalidateQueries: [
      TaskEvents.GetTasks,
      TaskEvents.CountByState,
      TaskEvents.GetActiveTask,
    ],
  });

  useIpcQuery<never, IsSyncingWithApisResult>(TaskEvents.IsSyncingWithApis, {
    onComplete: (data) => setIsSyncing(Boolean(data?.isSyncing)),
  });

  const [isSyncing, setIsSyncing] = useState(false);

  useIpcSubscriber(
    TaskSynchronizerSubscriptionTopics.SyncEnded,
    useCallback(() => {
      setIsSyncing(false);
    }, [])
  );

  return {
    isSyncing: isSyncing || syncMutation.isLoading,
    sync: useCallback(async () => {
      await syncMutation.mutateAsync();
    }, [syncMutation]),
    error: syncMutation.error,
  };
};
