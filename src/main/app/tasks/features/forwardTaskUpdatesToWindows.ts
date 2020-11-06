import { AppContext } from '../../../context';
import { RepositoryEvents } from '../../../shared/database/Repository';
import { sendEventToAllWindows } from '../../../shared/windows/sendEventToAllWindows';
import { TaskEvents } from '../../../../shared/types/tasks';

export const forwardTaskUpdatesToWindows = ({ taskRepository }: AppContext) => {
  taskRepository.events.on(RepositoryEvents.EntityUpdated, (task) => {
    if (!task.active) {
      return;
    }

    sendEventToAllWindows(TaskEvents.ActiveTaskUpdated, task);
  });
};
