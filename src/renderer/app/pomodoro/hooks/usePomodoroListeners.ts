import { useEffect } from 'react';
import { useIpcRenderer } from '../../../providers/IpcRendererProvider';
import { useSetRecoilState } from 'recoil';
import { pomodoroState } from '../state/pomodoroState';
import { Pomodoro, PomodoroSubscriptionTopics } from '../../../../shared/types';

export const usePomodoroListeners = () => {
  const ipc = useIpcRenderer();

  const setPomodoro = useSetRecoilState(pomodoroState);

  useEffect(() => {
    if (!ipc) {
      return;
    }

    const unsub = ipc.subscribe(
      PomodoroSubscriptionTopics.Updated,
      (_, pomodoro: Pomodoro) => {
        setPomodoro(pomodoro);
      }
    );

    return () => {
      unsub();
    };
  }, [ipc, setPomodoro]);
};
