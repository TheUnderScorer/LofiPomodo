import { Task, TaskSource } from './tasks';

export interface TaskApiService {
  readonly provider: TaskSource;

  syncTasks(): Promise<Task[]>;
}
