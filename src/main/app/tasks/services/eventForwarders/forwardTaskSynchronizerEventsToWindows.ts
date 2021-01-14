import { TaskSynchronizer } from '../TaskSynchronizer';
import { sendEventToAllWindows } from '../../../../shared/windows/sendEventToAllWindows';
import {
  TaskSynchronizerEvents,
  TaskSynchronizerFailedPayload,
} from '../../../../../shared/types/tasks';

export const forwardTaskSynchronizerEventsToWindows = (
  taskSynchronizer: TaskSynchronizer
) => {
  taskSynchronizer.events.onAny((event, payload) => {
    if (event === TaskSynchronizerEvents.SyncFailed) {
      sendEventToAllWindows(
        event,
        (payload as TaskSynchronizerFailedPayload).service.toJSON()
      );

      return;
    }

    sendEventToAllWindows(event, (payload as TaskSynchronizer).toJSON());
  });
};
