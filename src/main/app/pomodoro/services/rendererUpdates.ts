import { AppContext } from '../../../context';
import { PomodoroSubscriptionTopics } from '../../../../shared/types';
import { sendObservablesToWindows } from '../../../shared/windows/sendObservablesToAllWindows';

export const sendUpdatesToWindows = ({ pomodoroService }: AppContext) => {
  sendObservablesToWindows({
    [PomodoroSubscriptionTopics.PomodoroUpdated]:
      pomodoroService.state.changed$,
  });
};
