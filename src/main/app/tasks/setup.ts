import { AppContext } from '../../context';
import {
  CreateTaskInput,
  GetTasksPayload,
  Task,
  TaskEvents,
} from '../../../shared/types/tasks';
import { trackTaskDuration } from './features/trackTaskDuration';
import { forwardTaskUpdatesToWindows } from './features/forwardTaskUpdatesToWindows';

export const setupTasks = (context: AppContext) => {
  const { taskRepository, ipcService } = context;

  trackTaskDuration(context);
  forwardTaskUpdatesToWindows(context);

  ipcService.registerAsMap({
    [TaskEvents.GetTasks]: (_, payload: GetTasksPayload = {}) => {
      return taskRepository.listTasks(payload);
    },
    [TaskEvents.CreateTask]: (_, input: CreateTaskInput) => {
      return context.tasksService.createTask(input);
    },
    [TaskEvents.GetActiveTask]: async () => {
      return context.taskRepository.getActiveTask();
    },
    [TaskEvents.GetTasksByState]: () =>
      context.taskRepository.getAllGroupedByState(),
    [TaskEvents.UpdateTask]: (_, task: Task) =>
      context.taskRepository.update(task),
    [TaskEvents.UpdateTasks]: (_, tasks: Record<number, Task>) =>
      context.tasksService.updateTasks(Object.values(tasks)),
    [TaskEvents.CountByState]: () =>
      context.taskRepository.countGroupedByState(),
    [TaskEvents.DeleteTasks]: (_, ids: Record<number, string>) =>
      context.tasksService.deleteTasks(Object.values(ids)),
    [TaskEvents.DeleteCompletedTasks]: () =>
      context.taskRepository.deleteCompletedTasks(),
  });
};
