import { AppContext } from '../../context';
import {
  CreateTaskInput,
  GetTasksPayload,
  IsSyncingWithApisResult,
  Task,
  TaskOperations,
} from '../../../shared/types/tasks';
import { trackTaskDuration } from './services/trackTaskDuration/trackTaskDuration';
import { forwardTaskUpdatesToWindows } from './services/eventForwarders/forwardTaskUpdatesToWindows';
import { forwardTaskSynchronizerEventsToWindows } from './services/eventForwarders/forwardTaskSynchronizerEventsToWindows';

export const setupTasks = (context: AppContext) => {
  const { taskRepository, ipcService, taskSynchronizer } = context;

  trackTaskDuration(context);
  forwardTaskUpdatesToWindows(context.taskRepository);
  forwardTaskSynchronizerEventsToWindows(taskSynchronizer);

  ipcService.registerAsMap({
    [TaskOperations.GetTasks]: (_, payload: GetTasksPayload = {}) => {
      return taskRepository.listTasks(payload);
    },
    [TaskOperations.CreateTask]: (_, input: CreateTaskInput) => {
      return context.taskCrudService.createTask(input);
    },
    [TaskOperations.GetActiveTask]: async () => {
      return context.taskRepository.getActiveTask();
    },
    [TaskOperations.GetTasksByState]: () =>
      context.taskRepository.getAllGroupedByState(),
    [TaskOperations.UpdateTask]: (_, task: Task) =>
      context.taskCrudService.updateTasks([task]),
    [TaskOperations.UpdateTasks]: (_, tasks: Record<number, Task>) =>
      context.taskCrudService.updateTasks(Object.values(tasks)),
    [TaskOperations.CountByState]: () =>
      context.taskRepository.countGroupedByState(),
    [TaskOperations.DeleteTasks]: (_, ids: Record<number, string>) =>
      context.taskCrudService.deleteTasks(Object.values(ids)),
    [TaskOperations.DeleteCompletedTasks]: () =>
      context.taskRepository.deleteCompletedTasks(),
    [TaskOperations.SyncWithApis]: () => taskSynchronizer.synchronize(),
    [TaskOperations.IsSyncingWithApis]: (): IsSyncingWithApisResult => ({
      isSyncing: Boolean(taskSynchronizer.syncing),
    }),
  });
};
