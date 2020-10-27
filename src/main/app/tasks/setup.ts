import { AppContext } from '../../context';
import { GetTasksPayload, TaskEvents } from '../../../shared/types/tasks';

export const setupTasks = (context: AppContext) => {
  const { taskRepository, ipcService } = context;

  ipcService.registerAsMap({
    [TaskEvents.GetTasks]: (_, payload: GetTasksPayload = {}) => {
      return taskRepository.listTasks(payload);
    },
  });
};
