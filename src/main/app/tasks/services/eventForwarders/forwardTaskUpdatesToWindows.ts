import { TaskSubscriptionTopics } from '../../../../../shared/types/tasks';
import { TaskRepository } from '../../repositories/TaskRepository';
import { sendObservablesToWindows } from '../../../../shared/windows/sendObservablesToAllWindows';
import { filter, map } from 'rxjs/operators';
import { isTaskActive } from '../../../../../shared/app/tasks/isTaskActive';

export const forwardTaskUpdatesToWindows = (taskRepository: TaskRepository) => {
  taskRepository.entityUpdated$
    .pipe(filter((payload) => isTaskActive(payload.entity)))
    .subscribe((task) => {
      console.log(task);
    });

  sendObservablesToWindows({
    [TaskSubscriptionTopics.TasksDeleted]: taskRepository.entitiesDeleted$,
    [TaskSubscriptionTopics.ActiveTaskUpdated]: taskRepository.entityUpdated$.pipe(
      filter((payload) => isTaskActive(payload.entity)),
      map((payload) => payload.entity)
    ),
  });
};
