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
    [TaskEvents.GetActiveTask]: () => context.taskRepository.getActiveTask(),
    [TaskEvents.SetActiveTask]: (_, task: Task) =>
      context.tasksService.setActiveTask(task.id),
  });
};
