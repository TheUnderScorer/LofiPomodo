import { useCallback, useEffect, useRef } from 'react';
import { usePomodoro } from './usePomodoro';
import { useIpcSubscriber } from '../../../shared/ipc/useIpcSubscriber';
import { PomodoroOperations } from '../../../../shared/types';
import { addSeconds, format } from 'date-fns';

export const useBreakSoonNotification = () => {
  const notificationRef = useRef<Notification>();

  const { pomodoro } = usePomodoro();

  const remainingSeconds = pomodoro?.remainingSeconds ?? 0;

  const handle = useCallback(() => {
    if (!remainingSeconds || notificationRef.current) {
      return;
    }

    const date = addSeconds(new Date(), remainingSeconds);

    notificationRef.current = new Notification(`Break is starting soon.`, {
      body: `Break will start at ${format(date, 'HH:MM')}.`,
    });
  }, [remainingSeconds]);

  useIpcSubscriber(PomodoroOperations.BreakSoon, handle);

  useEffect(() => {
    if (!notificationRef?.current) {
      return;
    }

    const handleClose = () => {
      notificationRef.current = undefined;
    };

    notificationRef.current?.addEventListener('close', handleClose);

    return () => {
      notificationRef.current?.removeEventListener('close', handleClose);
    };
  }, [notificationRef]);
};
