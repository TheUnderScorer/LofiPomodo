import { useCallback } from 'react';
import {
  PomodoroOperations,
  PomodoroState,
  PomodoroSubscriptionTopics,
} from '../../../../shared/types';
import { useQueryClient } from 'react-query';
import { useIpcSubscriber } from '../../../shared/ipc/useIpcSubscriber';

export const usePomodoroListeners = () => {
  const queryClient = useQueryClient();

  const handleUpdate = useCallback(
    (_: undefined, state: PomodoroState) => {
      queryClient.setQueryData(PomodoroOperations.GetPomodoroState, state);
    },
    [queryClient]
  );

  useIpcSubscriber(PomodoroSubscriptionTopics.PomodoroUpdated, handleUpdate);
};
