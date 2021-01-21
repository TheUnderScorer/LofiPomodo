import { TaskSynchronizer } from '../TaskSynchronizer';
import { TaskSynchronizerSubscriptionTopics } from '../../../../../shared/types/tasks';
import { sendObservablesToWindows } from '../../../../shared/windows/sendObservablesToAllWindows';
import { map } from 'rxjs/operators';

export const forwardTaskSynchronizerEventsToWindows = (
  taskSynchronizer: TaskSynchronizer
) => {
  sendObservablesToWindows({
    [TaskSynchronizerSubscriptionTopics.SyncStarted]:
      taskSynchronizer.syncStarted$,
    [TaskSynchronizerSubscriptionTopics.SyncEnded]: taskSynchronizer.syncEnded$,
    [TaskSynchronizerSubscriptionTopics.SyncFailed]: taskSynchronizer.syncFailed$.pipe(
      map((payload) => payload.service.toJSON())
    ),
  });
};
