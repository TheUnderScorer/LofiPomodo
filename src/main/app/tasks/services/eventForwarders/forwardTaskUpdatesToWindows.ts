import { RepositoryEvents } from '../../../../shared/database/Repository';
import { sendEventToAllWindows } from '../../../../shared/windows/sendEventToAllWindows';
import { TaskEvents } from '../../../../../shared/types/tasks';
import { TaskRepository } from '../../repositories/TaskRepository';

export const forwardTaskUpdatesToWindows = (taskRepository: TaskRepository) => {
  taskRepository.events.on(RepositoryEvents.EntityUpdated, ({ entity }) => {
    sendEventToAllWindows(TaskEvents.TaskUpdated, entity);
  });

  taskRepository.events.on(RepositoryEvents.EntitiesDeleted, (tasks) => {
    sendEventToAllWindows(TaskEvents.TasksDeleted, tasks);
  });
};
