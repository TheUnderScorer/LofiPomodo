import { AppContext } from '../../context';
import {
  CreateTaskInput,
  GetTasksPayload,
  TaskEvents,
} from '../../../shared/types/tasks';

export const setupTasks = (context: AppContext) => {
  const { taskRepository, ipcService } = context;

  ipcService.registerAsMap({
    [TaskEvents.GetTasks]: (_, payload: GetTasksPayload = {}) => {
      return taskRepository.listTasks(payload);
    },
    [TaskEvents.CreateTask]: (_, input: CreateTaskInput) => {
      return context.tasksService.createTask(input);
    },
  });
};
