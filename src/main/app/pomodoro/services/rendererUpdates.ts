import { AppContext } from '../../../context';
import { PomodoroSubscriptionTopics } from '../../../../shared/types';
import { sendObservablesToWindows } from '../../../shared/windows/sendObservablesToAllWindows';

export const sendUpdatesToWindows = ({ pomodoro }: AppContext) => {
  sendObservablesToWindows({
    [PomodoroSubscriptionTopics.Updated]: pomodoro.changed$,
  });
};
