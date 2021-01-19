import { Task, TaskSource } from './tasks';

export interface TaskApiService {
  readonly provider: TaskSource;

  syncTasks(): Promise<SyncTasksResult>;
}

export interface SyncTasksResult {
  createdTasks?: Task[];
  deletedTasks?: Task[];
  updatedTasks?: Task[];
}
