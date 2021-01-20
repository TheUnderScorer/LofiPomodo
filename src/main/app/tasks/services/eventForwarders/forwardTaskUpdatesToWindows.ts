import { TaskSubscriptionTopics } from '../../../../../shared/types/tasks';
import { TaskRepository } from '../../repositories/TaskRepository';
import { sendObservablesToWindows } from '../../../../shared/windows/sendObservablesToAllWindows';
import { filter, first, map } from 'rxjs/operators';
import { isTaskActive } from '../../../../../shared/app/tasks/isTaskActive';

export const forwardTaskUpdatesToWindows = (taskRepository: TaskRepository) => {
  sendObservablesToWindows({
    [TaskSubscriptionTopics.TasksDeleted]: taskRepository.entitiesDeleted$,
    [TaskSubscriptionTopics.ActiveTaskUpdated]: taskRepository.entityUpdated$.pipe(
      filter((payload) => isTaskActive(payload.entity)),
      map((payload) => payload.entity),
      first()
    ),
  });
};
