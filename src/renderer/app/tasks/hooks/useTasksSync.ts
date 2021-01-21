import { useIpcMutation } from '../../../shared/ipc/useIpcMutation';
import {
  IsSyncingWithApisResult,
  TaskOperations,
  TaskSynchronizerSubscriptionTopics,
} from '../../../../shared/types/tasks';
import { useCallback, useState } from 'react';
import { useIpcSubscriber } from '../../../shared/ipc/useIpcSubscriber';
import { useIpcQuery } from '../../../shared/ipc/useIpcQuery';

export const useTasksSync = () => {
  const syncMutation = useIpcMutation<void>(TaskOperations.SyncWithApis, {
    invalidateQueries: [
      TaskOperations.GetTasks,
      TaskOperations.CountByState,
      TaskOperations.GetActiveTask,
    ],
  });

  useIpcQuery<never, IsSyncingWithApisResult>(
    TaskOperations.IsSyncingWithApis,
    {
      onComplete: (data) => setIsSyncing(Boolean(data?.isSyncing)),
    }
  );

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
