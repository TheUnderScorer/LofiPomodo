import { AppContext } from '../../../context';
import { RepositoryEvents } from '../../../shared/database/Repository';
import { findActiveTask } from '../arrayFinders/findActiveTask';
import { sendEventToAllWindows } from '../../../shared/windows/sendEventToAllWindows';
import { TaskEvents } from '../../../../shared/types/tasks';

export const forwardTaskUpdatesToWindows = ({ taskRepository }: AppContext) => {
  taskRepository.events.on(RepositoryEvents.EntitiesCreated, (tasks) => {
    const activeTask = findActiveTask(tasks);

    if (!activeTask) {
      return;
    }

    sendEventToAllWindows(TaskEvents.ActiveTaskUpdated, activeTask);
  });
};
