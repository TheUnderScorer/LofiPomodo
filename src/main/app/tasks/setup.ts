import { AppContext } from '../../context';
import {
  CreateTaskInput,
  GetTasksPayload,
  IsSyncingWithApisResult,
  Task,
  TaskEvents,
} from '../../../shared/types/tasks';
import { trackTaskDuration } from './services/trackTaskDuration';
import { forwardTaskUpdatesToWindows } from './services/eventForwarders/forwardTaskUpdatesToWindows';
import { forwardTaskSynchronizerEventsToWindows } from './services/eventForwarders/forwardTaskSynchronizerEventsToWindows';

export const setupTasks = (context: AppContext) => {
  const { taskRepository, ipcService, taskSynchronizer } = context;

  trackTaskDuration(context);
  forwardTaskUpdatesToWindows(context.taskRepository);
  forwardTaskSynchronizerEventsToWindows(taskSynchronizer);

  ipcService.registerAsMap({
    [TaskEvents.GetTasks]: (_, payload: GetTasksPayload = {}) => {
      return taskRepository.listTasks(payload);
    },
    [TaskEvents.CreateTask]: (_, input: CreateTaskInput) => {
      return context.taskCrudService.createTask(input);
    },
    [TaskEvents.GetActiveTask]: async () => {
      return context.taskRepository.getActiveTask();
    },
    [TaskEvents.GetTasksByState]: () =>
      context.taskRepository.getAllGroupedByState(),
    [TaskEvents.UpdateTask]: (_, task: Task) =>
      context.taskCrudService.updateTasks([task]),
    [TaskEvents.UpdateTasks]: (_, tasks: Record<number, Task>) =>
      context.taskCrudService.updateTasks(Object.values(tasks)),
    [TaskEvents.CountByState]: () =>
      context.taskRepository.countGroupedByState(),
    [TaskEvents.DeleteTasks]: (_, ids: Record<number, string>) =>
      context.taskCrudService.deleteTasks(Object.values(ids)),
    [TaskEvents.DeleteCompletedTasks]: () =>
      context.taskRepository.deleteCompletedTasks(),
    [TaskEvents.SyncWithApis]: () => taskSynchronizer.synchronize(),
    [TaskEvents.IsSyncingWithApis]: (): IsSyncingWithApisResult => ({
      isSyncing: taskSynchronizer.syncing,
    }),
  });
};
