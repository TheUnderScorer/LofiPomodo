import { useRecoilState } from 'recoil';
import { pomodoroState } from '../state/pomodoroState';
import { useIpcRenderer } from '../../../providers/IpcRendererProvider';
import { useEffect } from 'react';
import { Pomodoro, PomodoroEvents } from '../../../../shared/types';

export const usePomodoro = () => {
  const ipc = useIpcRenderer();
  const [pomodoro, setPomodoro] = useRecoilState(pomodoroState);

  useEffect(() => {
    const unsub = ipc.receive(PomodoroEvents.Updated, (pomodoro: Pomodoro) => {
      setPomodoro(pomodoro);
    });

    return () => {
      unsub();
    };
  }, [ipc, setPomodoro]);

  return { pomodoro };
};
