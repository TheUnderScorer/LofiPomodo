import { useCallback } from 'react';
import { PomodoroOperations, PomodoroState } from '../../../../shared/types';
import { useIpcQuery } from '../../../shared/ipc/useIpcQuery';
import { useIpcMutation } from '../../../shared/ipc/useIpcMutation';

export const usePomodoro = () => {
  const query = useIpcQuery<never, PomodoroState>(
    PomodoroOperations.GetPomodoroState
  );
  const updateMutation = useIpcMutation<PomodoroState>(
    PomodoroOperations.UpdatePomodoro
  );

  const update = useCallback(
    async (update: (prev: PomodoroState) => PomodoroState) => {
      const payload = update(query.data!);

      await updateMutation.mutateAsync(payload);
    },
    [query.data, updateMutation]
  );

  return { pomodoro: query.data ?? null, update, loading: query.isLoading };
};
